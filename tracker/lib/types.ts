export type Category = "leetcode" | "applied" | "uncategorized";

export type Person = {
  id: string;
  name: string;
  folder: string;
  color: string;
};

export type Terms = {
  repo: { owner: string; name: string; branch: string };
  people: Person[];
  stakeEach: number;
  escrowHolder: string;
  startDate: string;
  endDate: string;
  timezoneOffset: string;
  neetcodeMinPerWeek: number;
  appliedMinPerWeek: number;
  freeSkipWeeksAllowed: number;
};

export type Manifest = {
  terms: Terms;
  categories: Record<string, Category>;
};

export type Problem = {
  path: string;
  filename: string;
  personId: string;
  category: Category;
  date: string;
  commitSha: string;
  commitUrl: string;
  commitMessage: string;
};

export type WeekStatus = "upcoming" | "in_progress" | "completed";

export type Week = {
  index: number;
  start: string;
  end: string;
  status: WeekStatus;
  problems: Problem[];
  leetcodeCount: number;
  appliedCount: number;
  pass: boolean | null;
};

export type OverallStatus = "on_track" | "money_back" | "forfeited";

export type PersonResult = {
  person: Person;
  weeks: Week[];
  failedWeeks: number;
  skipsRemaining: number;
  overallStatus: OverallStatus;
  totalLeetcode: number;
  totalApplied: number;
  uncategorized: Problem[];
};

export type TrackerData = {
  terms: Terms;
  people: PersonResult[];
  now: string;
  daysRemaining: number;
  lastSynced: string;
};
