"use client";

import { WeekdayPicker } from "@/components/routines/WeekdayPicker";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useRoutineDraft } from "@/lib/store/routine-draft";
import { useRouter } from "next/navigation";

export default function RT2Page() {
  const router = useRouter();
  const daysOfWeek = useRoutineDraft((s) => s.daysOfWeek);
  const setDaysOfWeek = useRoutineDraft((s) => s.setDaysOfWeek);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={2}
          total={4}
          title="Which days?"
          sub="Pick the days you want to practice this habit."
          back="/routines/new"
          cancelHref="/today"
        />
      </div>
      <div className="flex-1 px-6 pb-6">
        <WeekdayPicker selected={daysOfWeek} onChange={setDaysOfWeek} />
      </div>
      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          disabled={daysOfWeek.length === 0}
          onClick={() => router.push("/routines/new/times")}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
