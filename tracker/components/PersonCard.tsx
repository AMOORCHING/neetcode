import type { PersonResult, Terms } from "@/lib/types";
import StatusPill from "./StatusPill";
import WeekCard from "./WeekCard";
import ActivityFeed from "./ActivityFeed";

const ACCENT: Record<string, string> = {
  akash: "bg-akash dark:bg-akash-dark",
  viraaj: "bg-viraaj dark:bg-viraaj-dark",
};

export default function PersonCard({
  result,
  terms,
}: {
  result: PersonResult;
  terms: Terms;
}) {
  const { person, weeks, failedWeeks, skipsRemaining, overallStatus, uncategorized } = result;
  const allProblems = weeks.flatMap((w) => w.problems).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="rounded-2xl border border-black/10 bg-surface p-5 shadow-sm dark:border-white/10 dark:bg-surface-dark sm:p-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${ACCENT[person.color] ?? "bg-ink-muted"}`} />
          <div>
            <h2 className="text-lg font-bold text-ink-primary dark:text-white">{person.name}</h2>
            <p className="text-xs text-ink-muted">
              ${terms.stakeEach.toLocaleString()} in escrow · {terms.escrowHolder}
            </p>
          </div>
        </div>
        <StatusPill status={overallStatus} />
      </header>

      <div className="mb-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/[0.03] py-2.5 dark:bg-white/[0.04]">
          <div className="text-xl font-bold tabular-nums text-ink-primary dark:text-white">
            {result.totalLeetcode}
          </div>
          <div className="text-[11px] text-ink-muted">LC solved</div>
        </div>
        <div className="rounded-lg bg-black/[0.03] py-2.5 dark:bg-white/[0.04]">
          <div className="text-xl font-bold tabular-nums text-ink-primary dark:text-white">
            {result.totalApplied}
          </div>
          <div className="text-[11px] text-ink-muted">Applied solved</div>
        </div>
        <div className="rounded-lg bg-black/[0.03] py-2.5 dark:bg-white/[0.04]">
          <div className="text-xl font-bold tabular-nums text-ink-primary dark:text-white">
            {skipsRemaining}/{terms.freeSkipWeeksAllowed}
          </div>
          <div className="text-[11px] text-ink-muted">Skips left</div>
        </div>
      </div>

      {failedWeeks > 0 && (
        <div className="mb-5 rounded-lg border border-status-critical/30 bg-status-critical/5 px-3 py-2 text-xs text-status-critical">
          {failedWeeks} week{failedWeeks > 1 ? "s" : ""} missed minimums
          {overallStatus === "forfeited"
            ? " — over the free-skip allowance, stake stays with escrow."
            : ` — ${skipsRemaining} skip${skipsRemaining === 1 ? "" : "s"} still available.`}
        </div>
      )}

      {uncategorized.length > 0 && (
        <div className="mb-5 rounded-lg border border-status-warning/40 bg-status-warning/10 px-3 py-2 text-xs text-ink-secondary dark:text-white/80">
          {uncategorized.length} file{uncategorized.length > 1 ? "s" : ""} not tagged in{" "}
          <code className="font-mono">tracker.config.json</code> — not counted toward either
          minimum: {uncategorized.map((p) => p.filename).join(", ")}
        </div>
      )}

      <div className="mb-5 flex gap-2.5 overflow-x-auto pb-1">
        {weeks.map((w) => (
          <WeekCard
            key={w.index}
            week={w}
            neetcodeMin={terms.neetcodeMinPerWeek}
            appliedMin={terms.appliedMinPerWeek}
          />
        ))}
      </div>

      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Recent activity
        </h3>
        <ActivityFeed problems={allProblems} />
      </div>
    </section>
  );
}
