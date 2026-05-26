"use client";

import { RoutineTypeCard } from "@/components/routines/RoutineTypeCard";
import { TimeList } from "@/components/routines/TimeList";
import { WeekdayPicker } from "@/components/routines/WeekdayPicker";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { updateRoutine } from "@/lib/routines/actions";
import { ROUTINE_LABELS, ROUTINE_TYPES, type RoutineType } from "@/lib/routines/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditState = {
  routineType: RoutineType;
  title: string;
  daysOfWeek: number[];
  timesOfDay: string[];
  goalPerWeek: number | null;
  timezone: string;
};

type Props = { id: string; initial: EditState };

export function EditRoutineForm({ id, initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<EditState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof EditState>(key: K, value: EditState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateRoutine(id, {
        title: state.title,
        routine_type: state.routineType,
        days_of_week: state.daysOfWeek,
        times_of_day: state.timesOfDay,
        goal_per_week: state.goalPerWeek,
        goal_unit: null,
        timezone: state.timezone,
      });
      if (result.ok) {
        router.push(`/routines/${id}`);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div
        style={{ paddingTop: "var(--space-18)" }}
        className="px-6 pb-4 flex items-center justify-between"
      >
        <Link
          href={`/routines/${id}`}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
        >
          <BackChevron />
        </Link>
        <h1 className="text-h2 text-ink">Edit routine</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-3 pl-1">Type</p>
          <div className="grid grid-cols-3 gap-3">
            {ROUTINE_TYPES.map((t) => (
              <RoutineTypeCard
                key={t}
                type={t}
                selected={state.routineType === t}
                onSelect={(type) =>
                  setState((s) => ({
                    ...s,
                    routineType: type,
                    title: type !== "custom" ? ROUTINE_LABELS[type] : s.title,
                  }))
                }
              />
            ))}
          </div>
          {state.routineType === "custom" && (
            <Input
              label="Name"
              variant="hero"
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={80}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-3 pl-1">Days</p>
          <WeekdayPicker selected={state.daysOfWeek} onChange={(days) => set("daysOfWeek", days)} />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-3 pl-1">Times</p>
          <TimeList times={state.timesOfDay} onChange={(times) => set("timesOfDay", times)} />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-3 pl-1">Weekly goal (optional)</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set("goalPerWeek", state.goalPerWeek === n ? null : n)}
                aria-pressed={state.goalPerWeek === n}
                className={cn(
                  "w-14 h-14 rounded-xl text-h2 font-semibold transition-colors border-[1.5px]",
                  state.goalPerWeek === n
                    ? "bg-blue text-white border-blue"
                    : "bg-card text-ink border-hair",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="text-caption text-orange">{error}</p> : null}
      </div>

      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          loading={loading}
          disabled={state.title.trim().length === 0 || state.daysOfWeek.length === 0}
          onClick={handleSave}
        >
          Save changes
        </Button>
      </div>
    </main>
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
