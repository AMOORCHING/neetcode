import { getFileOrigins, getManifest, getTree } from "./github";
import type {
  Category,
  OverallStatus,
  PersonResult,
  Problem,
  TrackerData,
  Week,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

function parseZoned(dateOnly: string, tzOffset: string): Date {
  return new Date(`${dateOnly}T00:00:00${tzOffset}`);
}

function buildWeekWindows(start: Date, end: Date) {
  const windows: { index: number; start: Date; end: Date }[] = [];
  let cursor = new Date(start);
  let index = 1;
  while (cursor < end) {
    const windowEnd = new Date(Math.min(cursor.getTime() + WEEK_MS, end.getTime()));
    windows.push({ index, start: new Date(cursor), end: windowEnd });
    cursor = new Date(cursor.getTime() + WEEK_MS);
    index++;
  }
  return windows;
}

export async function loadTrackerData(): Promise<TrackerData> {
  const manifest = await getManifest();
  const { terms, categories } = manifest;
  const { owner, name: repo, branch } = terms.repo;

  const [tree, origins] = await Promise.all([
    getTree(owner, repo, branch),
    getFileOrigins(owner, repo, branch),
  ]);

  const problemFiles = tree.filter((entry) => {
    if (entry.path.startsWith("tracker/")) return false;
    return terms.people.some((p) => entry.path.startsWith(`${p.folder}/`));
  });

  const problems: Problem[] = problemFiles.map((entry) => {
    const commit = origins.get(entry.path) ?? null;
    const personId =
      terms.people.find((p) => entry.path.startsWith(`${p.folder}/`))?.id ?? "unknown";
    const category: Category = categories[entry.path] ?? "uncategorized";
    const filename = entry.path.split("/").pop() ?? entry.path;
    return {
      path: entry.path,
      filename,
      personId,
      category,
      date: commit?.date ?? new Date(0).toISOString(),
      commitSha: commit?.sha ?? "",
      commitUrl: commit?.htmlUrl ?? `https://github.com/${owner}/${repo}`,
      commitMessage: commit?.message ?? "",
    };
  });

  const now = new Date();
  const start = parseZoned(terms.startDate, terms.timezoneOffset);
  const end = parseZoned(terms.endDate, terms.timezoneOffset);
  const windows = buildWeekWindows(start, end);

  const people: PersonResult[] = terms.people.map((person) => {
    const personProblems = problems
      .filter((p) => p.personId === person.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const uncategorized = personProblems.filter((p) => p.category === "uncategorized");

    const weeks: Week[] = windows.map((w) => {
      const inWindow = personProblems.filter((p) => {
        const t = new Date(p.date).getTime();
        return t >= w.start.getTime() && t < w.end.getTime();
      });
      const leetcodeCount = inWindow.filter((p) => p.category === "leetcode").length;
      const appliedCount = inWindow.filter((p) => p.category === "applied").length;

      let status: Week["status"];
      if (now.getTime() >= w.end.getTime()) status = "completed";
      else if (now.getTime() >= w.start.getTime()) status = "in_progress";
      else status = "upcoming";

      const pass =
        status === "completed"
          ? leetcodeCount >= terms.neetcodeMinPerWeek && appliedCount >= terms.appliedMinPerWeek
          : null;

      return {
        index: w.index,
        start: w.start.toISOString(),
        end: w.end.toISOString(),
        status,
        problems: inWindow,
        leetcodeCount,
        appliedCount,
        pass,
      };
    });

    const failedWeeks = weeks.filter((w) => w.pass === false).length;
    const skipsRemaining = Math.max(terms.freeSkipWeeksAllowed - failedWeeks, 0);
    const allWeeksSettled = weeks.every((w) => w.status === "completed");

    let overallStatus: OverallStatus;
    if (failedWeeks > terms.freeSkipWeeksAllowed) overallStatus = "forfeited";
    else if (allWeeksSettled) overallStatus = "money_back";
    else overallStatus = "on_track";

    return {
      person,
      weeks,
      failedWeeks,
      skipsRemaining,
      overallStatus,
      totalLeetcode: personProblems.filter((p) => p.category === "leetcode").length,
      totalApplied: personProblems.filter((p) => p.category === "applied").length,
      uncategorized,
    };
  });

  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY_MS));

  return {
    terms,
    people,
    now: now.toISOString(),
    daysRemaining,
    lastSynced: now.toISOString(),
  };
}
