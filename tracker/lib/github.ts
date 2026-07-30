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

export async function getFirstCommitForPath(
  owner: string,
  repo: string,
  path: string
): Promise<FirstCommit | null> {
  const commits = await ghFetch<
    Array<{
      sha: string;
      html_url: string;
      commit: { author: { name: string; date: string }; message: string };
    }>
  >(`/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=100`);

  if (commits.length === 0) return null;
  // GitHub returns newest first; the file's "publish" moment is its oldest commit.
  const oldest = commits[commits.length - 1];
  return {
    sha: oldest.sha,
    date: oldest.commit.author.date,
    authorName: oldest.commit.author.name,
    message: oldest.commit.message.split("\n")[0],
    htmlUrl: oldest.html_url,
  };
}
