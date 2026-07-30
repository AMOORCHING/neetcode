import { loadTrackerData } from "@/lib/compute";
import { formatDate } from "@/lib/format";
import { offsetToIanaZone } from "@/lib/tz";
import PersonCard from "@/components/PersonCard";
import RefreshButton from "@/components/RefreshButton";

// Data comes from the live GitHub API, not from anything known at build time —
// render per-request. The underlying fetch() calls in lib/github.ts still get
// cached for 120s via Next's Data Cache, so this doesn't hit GitHub on every hit.
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadTrackerData();
  const { terms } = data;
  const tz = offsetToIanaZone(terms.timezoneOffset);
  const repoUrl = `https://github.com/${terms.repo.owner}/${terms.repo.name}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">
            The Bet
          </p>
          <h1 className="text-2xl font-black tracking-tight text-ink-primary dark:text-white sm:text-3xl">
            Accountability Tracker
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-ink-secondary dark:text-white/70">
            {terms.neetcodeMinPerWeek} NeetCode + {terms.appliedMinPerWeek} applied problem per
            week, {formatDate(terms.startDate, tz)} → {formatDate(terms.endDate, tz)}. Every row is a
            GitHub commit — nothing here is self-reported.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <RefreshButton />
          <p className="text-[11px] text-ink-muted">
            {data.daysRemaining > 0
              ? `${data.daysRemaining} day${data.daysRemaining === 1 ? "" : "s"} left`
              : "Bet period ended"}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {data.people.map((result) => (
          <PersonCard key={result.person.id} result={result} terms={terms} tz={tz} />
        ))}
      </div>

      <footer className="mt-10 flex flex-col gap-1 border-t border-black/10 pt-5 text-xs text-ink-muted dark:border-white/10">
        <p>
          Reading live from{" "}
          <a href={repoUrl} target="_blank" rel="noreferrer" className="underline">
            {terms.repo.owner}/{terms.repo.name}
          </a>{" "}
          · categories tagged in{" "}
          <a
            href={`${repoUrl}/blob/${terms.repo.branch}/tracker/tracker.config.json`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            tracker.config.json
          </a>
        </p>
        <p>Synced {formatDate(data.lastSynced, tz)} · auto-refreshes every 2 minutes</p>
      </footer>
    </main>
  );
}
