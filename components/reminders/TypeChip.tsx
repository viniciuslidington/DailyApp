"use client";

import type { ReminderType } from "@/lib/reminders/schema";
import { cn } from "@/lib/utils";

const TYPE_VISUALS: Record<ReminderType, { icon: string; label: string; tintClass: string }> = {
  meeting: { icon: "◆", label: "Meeting", tintClass: "bg-blue" },
  event: { icon: "✦", label: "Event", tintClass: "bg-orange" },
  deadline: { icon: "◷", label: "Deadline", tintClass: "bg-purple" },
  task: { icon: "✓", label: "Task", tintClass: "bg-success" },
};

type TypeChipProps = {
  type: ReminderType;
  selected: boolean;
  onSelect: (type: ReminderType) => void;
};

export function TypeChip({ type, selected, onSelect }: TypeChipProps) {
  const v = TYPE_VISUALS[type];
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={selected}
      className={cn(
        "flex-1 rounded-base bg-card border-[1.5px] flex flex-col items-center gap-2",
        "py-3.5 px-2.5 transition-colors",
        selected ? "border-blue" : "border-hair",
      )}
    >
      <span
        className={cn(
          "w-8 h-8 rounded-sm flex items-center justify-center text-white text-action font-bold",
          v.tintClass,
        )}
        aria-hidden
      >
        {v.icon}
      </span>
      <span className={cn("text-micro font-medium", selected ? "text-blue" : "text-ink-2")}>
        {v.label}
      </span>
    </button>
  );
}

export { TYPE_VISUALS };
