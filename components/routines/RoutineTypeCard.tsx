"use client";

import {
  ROUTINE_ICONS,
  ROUTINE_ICON_COLORS,
  ROUTINE_LABELS,
  ROUTINE_TINTS,
  type RoutineType,
} from "@/lib/routines/schema";
import { cn } from "@/lib/utils";

type RoutineTypeCardProps = {
  type: RoutineType;
  selected: boolean;
  onSelect: (type: RoutineType) => void;
};

export function RoutineTypeCard({ type, selected, onSelect }: RoutineTypeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 rounded-2xl border-[1.5px] py-5 transition-colors",
        selected ? "border-blue bg-blue-soft" : "border-hair bg-card",
      )}
    >
      <span
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
          ROUTINE_TINTS[type],
          ROUTINE_ICON_COLORS[type],
        )}
      >
        {ROUTINE_ICONS[type]}
      </span>
      <span className={cn("text-meta font-semibold", selected ? "text-blue" : "text-ink")}>
        {ROUTINE_LABELS[type]}
      </span>
    </button>
  );
}
