"use client";

import { cn } from "@/lib/utils";

type TimePickerProps = {
  /** HH:MM 24h. */
  value: string;
  onChange: (next: string) => void;
  /** Inline label; renders to the left of the inputs. */
  label?: string;
};

/**
 * Minimal native time picker styled as a card row (CR2 Time row + CR3c pills).
 * Reads/writes "HH:MM" 24h strings; the browser handles 12/24h display per
 * locale, which is good enough for MVP without a custom wheel inside this flow
 * (the wheel only lives in onboarding).
 */
export function TimePicker({ value, onChange, label = "Time" }: TimePickerProps) {
  return (
    <div className="flex items-center justify-between bg-card rounded-lg border border-hair px-[18px] py-3.5">
      <div>
        <div className="text-caption text-ink-2">{label}</div>
        <div className="text-body-lg text-ink tabular-nums mt-0.5">{format12h(value)}</div>
      </div>
      <label className="relative">
        <span
          className={cn(
            "px-3.5 py-2 rounded-sm bg-blue-soft text-blue text-meta font-semibold cursor-pointer",
          )}
        >
          Change
        </span>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Pick a time"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
}

export function format12h(value: string): string {
  const [hStr, mStr] = value.split(":");
  const h = Number(hStr ?? "0");
  const m = Number(mStr ?? "0");
  const period = h >= 12 ? "PM" : "AM";
  const display = ((h + 11) % 12) + 1;
  return `${display}:${m.toString().padStart(2, "0")} ${period}`;
}
