"use client";

import { toggleRoutineLog } from "@/lib/routines/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  routineId: string;
  logDate: string;
  isDone: boolean;
  unitLabel: string;
};

export function LogSessionButton({ routineId, logDate, isDone: initialDone, unitLabel }: Props) {
  const router = useRouter();
  const [isDone, setIsDone] = useState(initialDone);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const prev = isDone;
    setIsDone(!prev);
    const result = await toggleRoutineLog(routineId, logDate, prev);
    if (!result.ok) setIsDone(prev);
    setLoading(false);
    router.refresh();
  };

  if (isDone) {
    return (
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        className="w-full h-[50px] rounded-2xl border-[1.5px] border-blue bg-blue-soft text-blue text-body font-semibold flex items-center justify-center gap-2"
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
          <title>Done</title>
          <path
            d="M1 6l5 5L15 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Done today
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={loading}
      className="w-full h-[50px] rounded-2xl text-white text-body font-semibold flex items-center justify-center gap-1.5"
      style={{ background: "var(--color-blue)" }}
    >
      <span className="text-lg leading-none">+</span>
      Log a {unitLabel}
    </button>
  );
}
