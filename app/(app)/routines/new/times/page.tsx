"use client";

import { TimeList } from "@/components/routines/TimeList";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useRoutineDraft } from "@/lib/store/routine-draft";
import { useRouter } from "next/navigation";

export default function RT3Page() {
  const router = useRouter();
  const timesOfDay = useRoutineDraft((s) => s.timesOfDay);
  const setTimesOfDay = useRoutineDraft((s) => s.setTimesOfDay);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={4}
          title="What time?"
          sub="Add one or more daily notification times."
          back="/routines/new/days"
          cancelHref="/today"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <TimeList times={timesOfDay} onChange={setTimesOfDay} />
      </div>
      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          disabled={timesOfDay.length === 0}
          onClick={() => router.push("/routines/new/goal")}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
