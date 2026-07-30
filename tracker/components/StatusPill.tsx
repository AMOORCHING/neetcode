import type { OverallStatus } from "@/lib/types";

const CONFIG: Record<OverallStatus, { label: string; className: string; dot: string }> = {
  on_track: {
    label: "On Track",
    className: "bg-status-good/10 text-status-good ring-1 ring-status-good/30",
    dot: "bg-status-good",
  },
  money_back: {
    label: "Money Secured",
    className: "bg-status-good/10 text-status-good ring-1 ring-status-good/30",
    dot: "bg-status-good",
  },
  forfeited: {
    label: "Forfeited",
    className: "bg-status-critical/10 text-status-critical ring-1 ring-status-critical/30",
    dot: "bg-status-critical",
  },
};

export default function StatusPill({ status }: { status: OverallStatus }) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${c.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label.toUpperCase()}
    </span>
  );
}
