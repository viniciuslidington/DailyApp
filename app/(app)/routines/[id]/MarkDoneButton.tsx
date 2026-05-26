"use client";

import { toggleRoutineLog } from "@/lib/routines/actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { routineId: string; logDate: string; isDone: boolean };

export function MarkDoneButton({ routineId, logDate, isDone: initialDone }: Props) {
  const router = useRouter();
  const [isDone, setIsDone] = useState(initialDone);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    setIsDone((prev) => !prev);
    const result = await toggleRoutineLog(routineId, logDate, isDone);
    if (!result.ok) setIsDone(isDone);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "w-full h-[54px] rounded-lg flex items-center justify-center gap-2 text-body-lg font-semibold transition-colors",
        isDone ? "bg-success/10 text-success border border-success/20" : "bg-blue text-white",
      )}
      style={isDone ? undefined : { boxShadow: "var(--shadow-primary)" }}
    >
      {isDone ? (
        <>
          <span aria-hidden>✓</span> Done today
        </>
      ) : (
        "Mark as done"
      )}
    </button>
  );
}
