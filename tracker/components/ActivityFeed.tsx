import type { Problem } from "@/lib/types";
import { relativeTime } from "@/lib/format";

const CATEGORY_LABEL: Record<Problem["category"], string> = {
  leetcode: "LC",
  applied: "Applied",
  uncategorized: "Uncategorized",
};

const CATEGORY_CLASS: Record<Problem["category"], string> = {
  leetcode: "bg-akash/10 text-akash dark:text-akash-dark",
  applied: "bg-viraaj/10 text-viraaj dark:text-viraaj-dark",
  uncategorized: "bg-status-warning/10 text-status-warning",
};

export default function ActivityFeed({ problems }: { problems: Problem[] }) {
  const recent = problems.slice(0, 6);

  if (recent.length === 0) {
    return <p className="text-sm text-ink-muted">Nothing pushed yet.</p>;
  }

  return (
    <ul className="divide-y divide-black/5 dark:divide-white/10">
      {recent.map((p) => (
        <li key={p.path} className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0">
            <a
              href={p.commitUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate text-sm font-medium text-ink-primary hover:underline dark:text-white"
            >
              {p.filename}
            </a>
            <div className="truncate text-xs text-ink-muted">{p.commitMessage}</div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${CATEGORY_CLASS[p.category]}`}
            >
              {CATEGORY_LABEL[p.category]}
            </span>
            <span className="text-[11px] text-ink-muted">{relativeTime(p.date)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
