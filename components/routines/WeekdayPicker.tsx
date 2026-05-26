"use client";

import { cn } from "@/lib/utils";

const DAYS = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
] as const;

type WeekdayPickerProps = {
  selected: number[];
  onChange: (days: number[]) => void;
};

export function WeekdayPicker({ selected, onChange }: WeekdayPickerProps) {
  const set = new Set(selected);

  const toggle = (day: number) => {
    if (set.has(day)) {
      if (set.size === 1) return;
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day].sort((a, b) => a - b));
    }
  };

  return (
    <div className="flex gap-2 justify-between">
      {DAYS.map(({ label, value }) => {
        const active = set.has(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            aria-pressed={active}
            className={cn(
              "flex-1 h-11 rounded-xl text-meta font-semibold transition-colors",
              active ? "bg-blue text-white" : "bg-card border border-hair text-ink-2",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
