"use client";

import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useRoutineDraft } from "@/lib/store/routine-draft";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GOAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export default function RT4Page() {
  const router = useRouter();
  const goalPerWeek = useRoutineDraft((s) => s.goalPerWeek);
  const setGoalPerWeek = useRoutineDraft((s) => s.setGoalPerWeek);
  const [localGoal, setLocalGoal] = useState<number | null>(goalPerWeek);

  const handleContinue = () => {
    setGoalPerWeek(localGoal);
    router.push("/routines/new/created");
  };

  const handleSkip = () => {
    setGoalPerWeek(null);
    router.push("/routines/new/created");
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={4}
          total={4}
          title="Set a weekly goal?"
          sub="Optional — track how often you complete this habit per week."
          back="/routines/new/times"
          cancelHref="/today"
        />
      </div>
      <div className="flex-1 px-6 pb-6 flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          {GOAL_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setLocalGoal(localGoal === n ? null : n)}
              aria-pressed={localGoal === n}
              className={cn(
                "w-14 h-14 rounded-xl text-h2 font-semibold transition-colors border-[1.5px]",
                localGoal === n ? "bg-blue text-white border-blue" : "bg-card text-ink border-hair",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        {localGoal !== null && <p className="text-body text-ink-2">Goal: {localGoal}× per week</p>}
      </div>
      <div className="px-6 pb-3.5 flex flex-col gap-2">
        <Button variant="primary" onClick={handleContinue}>
          {localGoal !== null ? "Continue" : "Skip"}
        </Button>
        {localGoal !== null && (
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        )}
      </div>
    </main>
  );
}
