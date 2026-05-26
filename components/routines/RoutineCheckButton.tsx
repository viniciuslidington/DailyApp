"use client";

import { toggleRoutineLog } from "@/lib/routines/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { routineId: string; logDate: string; isDone: boolean };

export function RoutineCheckButton({ routineId, logDate, isDone: initial }: Props) {
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
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 border-[1.5px] ${
        isDone ? "bg-success border-success" : "bg-transparent border-mute"
      }`}
    >
      {isDone && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
          <title>Done</title>
          <path
            d="M1 5l3.5 3.5 6.5-8"
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
