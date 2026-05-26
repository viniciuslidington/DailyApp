"use client";

import { Button } from "@/components/shared/Button";
import { createRoutine } from "@/lib/routines/actions";
import { useRoutineDraft } from "@/lib/store/routine-draft";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RT5Page() {
  const router = useRouter();

  // Read all draft values once on mount — stable refs prevent re-runs.
  const title = useRoutineDraft((s) => s.title);
  const routineType = useRoutineDraft((s) => s.routineType);
  const daysOfWeek = useRoutineDraft((s) => s.daysOfWeek);
  const timesOfDay = useRoutineDraft((s) => s.timesOfDay);
  const goalPerWeek = useRoutineDraft((s) => s.goalPerWeek);
  const timezone = useRoutineDraft((s) => s.timezone);
  const reset = useRoutineDraft((s) => s.reset);

  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    // Guard against re-entry with an already-reset draft (e.g. BFCache after success)
    if (!title || daysOfWeek.length === 0 || timesOfDay.length === 0) return;
    called.current = true;

    createRoutine({
      title,
      routine_type: routineType,
      days_of_week: daysOfWeek,
      times_of_day: timesOfDay,
      goal_per_week: goalPerWeek ?? null,
      goal_unit: null,
      timezone,
    }).then((result) => {
      if (result.ok) {
        reset();
        setId(result.data.id);
      } else {
        setError(result.error);
      }
    });
  }, [title, routineType, daysOfWeek, timesOfDay, goalPerWeek, timezone, reset]);

  if (error) {
    return (
      <main className="absolute inset-0 flex flex-col bg-bg items-center justify-center px-6 gap-4">
        <p className="text-body text-orange text-center">{error}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-meta text-blue font-medium"
        >
          Go back
        </button>
      </main>
    );
  }

  if (!id) {
    return (
      <main className="absolute inset-0 flex flex-col bg-bg items-center justify-center">
        <span className="w-6 h-6 rounded-full border-2 border-blue/30 border-t-blue animate-spin" />
      </main>
    );
  }

  return (
    <main className="absolute inset-0 flex flex-col bg-bg items-center justify-center px-6">
      <div className="flex flex-col items-center gap-5 mb-14">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(31,179,100,0.12)" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
            <title>Success</title>
            <circle cx="18" cy="18" r="18" fill="var(--color-success)" fillOpacity="0.12" />
            <path
              d="M10 18l6 6 10-12"
              stroke="var(--color-success)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-title text-ink mb-2">Routine created!</h1>
          <p className="text-body text-ink-2">Stay consistent — it gets easier every day.</p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <Link href={`/routines/${id}`}>
          <Button variant="primary" className="w-full">
            View routine
          </Button>
        </Link>
        <Link href="/today">
          <Button variant="ghost" className="w-full">
            Back to Today
          </Button>
        </Link>
      </div>
    </main>
  );
}
