"use client";

import { toggleRoutineLog } from "@/lib/routines/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  routineId: string;
  logDate: string;
  isDone: boolean;
  borderColorClass?: string;
};

export function RoutineCheckButton({
  routineId,
  logDate,
  isDone: initial,
  borderColorClass = "border-mute",
}: Props) {
  const router = useRouter();
  const [isDone, setIsDone] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    const prev = isDone;
    setIsDone(!prev);
    setLoading(true);
    try {
      const result = await toggleRoutineLog(routineId, logDate, prev);
      if (!result.ok) {
        setIsDone(prev);
      } else {
        router.refresh();
      }
    } catch {
      setIsDone(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDone ? "Mark undone" : "Mark done"}
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-[1.5px] transition-colors ${
        isDone ? "bg-blue border-blue" : `bg-transparent ${borderColorClass}`
      }`}
    >
      {isDone && (
        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden>
          <title>Done</title>
          <path
            d="M1 5.5l4 4L12 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
