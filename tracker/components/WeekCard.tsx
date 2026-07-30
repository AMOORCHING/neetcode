import type { Week } from "@/lib/types";

function fmtRange(startIso: string, endIso: string, tz: string) {
  const start = new Date(startIso);
  const end = new Date(new Date(endIso).getTime() - 1);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: tz };
  return `${start.toLocaleDateString("en-US", opts)}–${end.toLocaleDateString("en-US", opts)}`;
}

function Bar({ count, min }: { count: number; min: number }) {
  const pct = min === 0 ? 100 : Math.min(100, (count / min) * 100);
  const met = count >= min;
  return (
    <div className="h-1.5 w-full rounded-full bg-grid dark:bg-grid-dark">
      <div
        className={`h-1.5 rounded-full transition-all ${
          met ? "bg-status-good" : "bg-status-warning"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const STATUS_META: Record<
  "pass" | "fail" | "live" | "upcoming",
  { label: string; ring: string; text: string; bg: string }
> = {
  pass: {
    label: "PASS",
    ring: "ring-status-good/40",
    text: "text-status-good",
    bg: "bg-status-good/10",
  },
  fail: {
    label: "FAIL",
    ring: "ring-status-critical/40",
    text: "text-status-critical",
    bg: "bg-status-critical/10",
  },
  live: {
    label: "LIVE",
    ring: "ring-status-warning/40",
    text: "text-ink-secondary dark:text-ink-secondary-dark",
    bg: "bg-status-warning/10",
  },
  upcoming: {
    label: "UPCOMING",
    ring: "ring-baseline/40",
    text: "text-ink-muted",
    bg: "bg-transparent",
  },
};

export default function WeekCard({
  week,
  neetcodeMin,
  appliedMin,
  tz,
}: {
  week: Week;
  neetcodeMin: number;
  appliedMin: number;
  tz: string;
}) {
  const key =
    week.status === "upcoming"
      ? "upcoming"
      : week.status === "in_progress"
        ? "live"
        : week.pass
          ? "pass"
          : "fail";
  const meta = STATUS_META[key];

  return (
    <div
      className={`min-w-[168px] flex-1 rounded-xl border border-black/10 p-3 dark:border-white/10 ${meta.bg}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-secondary dark:text-white/70">
          Week {week.index}
        </span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide ring-1 ${meta.ring} ${meta.text}`}
        >
          {meta.label}
        </span>
      </div>
      <div className="mb-2.5 text-[11px] text-ink-muted">{fmtRange(week.start, week.end, tz)}</div>

      {week.status === "upcoming" ? (
        <div className="text-[11px] text-ink-muted">Not started</div>
      ) : (
        <div className="space-y-2">
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-ink-secondary dark:text-white/70">
              <span>NeetCode LC</span>
              <span className="tabular-nums font-medium">
                {week.leetcodeCount}/{neetcodeMin}
              </span>
            </div>
            <Bar count={week.leetcodeCount} min={neetcodeMin} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-ink-secondary dark:text-white/70">
              <span>Applied</span>
              <span className="tabular-nums font-medium">
                {week.appliedCount}/{appliedMin}
              </span>
            </div>
            <Bar count={week.appliedCount} min={appliedMin} />
          </div>
        </div>
      )}
    </div>
  );
}
