"use client";

import { RoutineTypeCard } from "@/components/routines/RoutineTypeCard";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { Input } from "@/components/shared/Input";
import { ROUTINE_LABELS, ROUTINE_TYPES } from "@/lib/routines/schema";
import { useRoutineDraft } from "@/lib/store/routine-draft";
import { useRouter } from "next/navigation";

export default function RT1Page() {
  const router = useRouter();
  const routineType = useRoutineDraft((s) => s.routineType);
  const title = useRoutineDraft((s) => s.title);
  const setRoutineType = useRoutineDraft((s) => s.setRoutineType);
  const setTitle = useRoutineDraft((s) => s.setTitle);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={1}
          total={4}
          title="What do you want to build a habit for?"
          sub="Pick a preset or create your own."
          back="/today"
          cancelHref="/today"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          {ROUTINE_TYPES.map((t) => (
            <RoutineTypeCard
              key={t}
              type={t}
              selected={routineType === t}
              onSelect={(type) => setRoutineType(type, ROUTINE_LABELS[type])}
            />
          ))}
        </div>

        {routineType === "custom" && (
          <Input
            variant="hero"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning run"
            maxLength={80}
            autoFocus
          />
        )}
      </div>
      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          disabled={title.trim().length === 0}
          onClick={() => router.push("/routines/new/days")}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
