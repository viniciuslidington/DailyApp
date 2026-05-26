"use client";

import { useReminderDraft } from "@/lib/store/reminder-draft";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FlowHeaderProps = {
  step: number;
  total?: number;
  title: string;
  sub?: string;
  /** Where the back chip points. Falls back to router.back(). */
  back?: string;
  /** Override the cancel destination (defaults to /today). */
  cancelHref?: string;
};

/**
 * Shared chrome for the multi-step create/edit flows (DESIGN.md §3.7).
 * Back chip · "Step X of Y" · Cancel · progress bar · title · subtitle.
 * Cancel clears the reminder draft so the next "+" entry starts fresh.
 */
export function FlowHeader({
  step,
  total = 5,
  title,
  sub,
  back,
  cancelHref = "/today",
}: FlowHeaderProps) {
  const router = useRouter();
  const resetDraft = useReminderDraft((s) => s.reset);
  const pct = Math.min(100, Math.round((step / total) * 100));

  return (
    <div>
      <div className="flex items-center justify-between px-6 mb-[22px]">
        {back ? (
          <Link
            href={back}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
          >
            <BackChevron />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
          >
            <BackChevron />
          </button>
        )}
        <div className="text-caption text-ink-3 tabular-nums">
          Step {step} of {total}
        </div>
        <Link href={cancelHref} onClick={() => resetDraft()} className="text-meta text-ink-2">
          Cancel
        </Link>
      </div>

      <div className="px-6 mb-6">
        <div className="h-1 bg-track rounded-xs overflow-hidden">
          <div
            className="h-full bg-blue rounded-xs transition-[width] duration-[var(--motion-base)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="px-6 mb-6">
        <h1 className="text-title text-ink mb-1.5">{title}</h1>
        {sub ? <p className="text-body text-ink-2 leading-snug">{sub}</p> : null}
      </div>
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden>
      <title>Back</title>
      <path
        d="M7 1L1 7l6 6"
        stroke="var(--color-ink-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
