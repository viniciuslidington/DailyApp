"use client";

import { cn } from "@/lib/utils";

const DAYS = [
  { label: "S", full: "Sunday", value: 0 },
  { label: "M", full: "Monday", value: 1 },
  { label: "T", full: "Tuesday", value: 2 },
  { label: "W", full: "Wednesday", value: 3 },
  { label: "T", full: "Thursday", value: 4 },
  { label: "F", full: "Friday", value: 5 },
  { label: "S", full: "Saturday", value: 6 },
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
      {DAYS.map(({ label, full, value }) => {
        const active = set.has(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            aria-pressed={active}
            aria-label={full}
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
