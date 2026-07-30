import type { Manifest } from "./types";

// Where tracker.config.json itself lives. Everything else (file tree, commit
// history) is read from `terms.repo` inside that config, so pointing this at
// a fork only requires updating this one constant.
const CONFIG_OWNER = process.env.GITHUB_CONFIG_OWNER || "AMOORCHING";
const CONFIG_REPO = process.env.GITHUB_CONFIG_REPO || "neetcode";
const CONFIG_BRANCH = process.env.GITHUB_CONFIG_BRANCH || "main";
const CONFIG_PATH = "tracker/tracker.config.json";

const REVALIDATE_SECONDS = 120;

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: ghHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${path} -> ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

export async function getManifest(): Promise<Manifest> {
  const data = await ghFetch<{ content: string; encoding: string }>(
    `/repos/${CONFIG_OWNER}/${CONFIG_REPO}/contents/${CONFIG_PATH}?ref=${CONFIG_BRANCH}`
  );
  const raw = Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf-8");
  return JSON.parse(raw) as Manifest;
}

export type TreeEntry = { path: string; type: "blob" | "tree"; sha: string };

export async function getTree(owner: string, repo: string, branch: string): Promise<TreeEntry[]> {
  const data = await ghFetch<{ tree: TreeEntry[]; truncated: boolean }>(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  return data.tree.filter((t) => t.type === "blob");
}

export type FirstCommit = {
  sha: string;
  date: string;
  authorName: string;
  message: string;
  htmlUrl: string;
};

type CommitListItem = {
  sha: string;
  html_url: string;
  commit: { author: { name: string; date: string }; message: string };
};

async function listAllCommits(owner: string, repo: string, branch: string) {
  const commits: CommitListItem[] = [];
  let page = 1;
  for (;;) {
    const batch = await ghFetch<CommitListItem[]>(
      `/repos/${owner}/${repo}/commits?sha=${branch}&per_page=100&page=${page}`
    );
    commits.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  // Oldest first, so renames/edits can be folded forward in order.
  return commits.reverse();
}

type CommitFile = { filename: string; status: string; previous_filename?: string };

async function getCommitFiles(owner: string, repo: string, sha: string) {
  const data = await ghFetch<{ files?: CommitFile[] }>(`/repos/${owner}/${repo}/commits/${sha}`);
  return data.files ?? [];
}

/**
 * True "publish" date per current file path, following renames — GitHub's
 * path-scoped /commits endpoint does NOT follow renames (unlike local
 * `git log --follow`), so a `git mv` resets a file's history there. This
 * walks every commit in order and carries each file's origin commit forward
 * through renames, the same way `--follow` does locally.
 */
export async function getFileOrigins(
  owner: string,
  repo: string,
  branch: string
): Promise<Map<string, FirstCommit>> {
  const commits = await listAllCommits(owner, repo, branch);
  const filesByCommit = await Promise.all(
    commits.map((c) => getCommitFiles(owner, repo, c.sha))
  );

  const origins = new Map<string, FirstCommit>();

  commits.forEach((c, i) => {
    const meta: FirstCommit = {
      sha: c.sha,
      date: c.commit.author.date,
      authorName: c.commit.author.name,
      message: c.commit.message.split("\n")[0],
      htmlUrl: c.html_url,
    };
    for (const f of filesByCommit[i]) {
      if (f.status === "renamed" && f.previous_filename) {
        const prior = origins.get(f.previous_filename);
        origins.delete(f.previous_filename);
        origins.set(f.filename, prior ?? meta);
      } else if (f.status === "removed") {
        origins.delete(f.filename);
      } else if (!origins.has(f.filename)) {
        // "added" (first sighting), or "modified" with no earlier record.
        origins.set(f.filename, meta);
      }
    }
  });

  return origins;
}
