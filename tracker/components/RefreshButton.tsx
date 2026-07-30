"use client";

import { useTransition } from "react";
import { refreshData } from "@/app/actions";

export default function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => refreshData())}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-ink-secondary transition hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
    >
      <svg
        className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
        <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {isPending ? "Syncing…" : "Sync now"}
    </button>
  );
}
