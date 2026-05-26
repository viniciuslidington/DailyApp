"use client";

import { cn } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useState } from "react";

type DatePickerProps = {
  /** YYYY-MM-DD */
  value: string;
  onChange: (next: string) => void;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Mini month calendar matching CR2 in the design. Pure date math — the parent
 * owns timezone semantics (the picker only deals with local calendar days).
 */
export function DatePicker({ value, onChange }: DatePickerProps) {
  const selected = parseISO(value);
  const [view, setView] = useState<Date>(startOfMonth(selected));
  const today = new Date();

  const gridStart = startOfWeek(startOfMonth(view), { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(view), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="bg-card rounded-2xl border border-hair px-3 py-3.5">
      <div className="flex justify-between items-center px-2.5 pb-2.5">
        <div className="text-h2 text-ink">{format(view, "MMMM yyyy")}</div>
        <div className="flex gap-3.5 text-ink-3">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setView((v) => addMonths(v, -1))}
            className="text-meta px-2"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setView((v) => addMonths(v, 1))}
            className="text-meta px-2"
          >
            ›
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px px-1 pb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={`${w}-${i}`}
            className="h-[22px] flex items-center justify-center text-[11px] font-semibold text-ink-3 uppercase"
          >
            {w}
          </div>
        ))}
        {days.map((d) => {
          const inMonth = isSameMonth(d, view);
          const isSel = isSameDay(d, selected);
          const isToday = isSameDay(d, today);
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onChange(format(d, "yyyy-MM-dd"))}
              className={cn(
                "h-9 flex items-center justify-center rounded-xl text-[15px] tabular-nums transition-colors",
                !inMonth && "text-ink-3 opacity-40",
                inMonth && !isSel && !isToday && "text-ink",
                isToday && !isSel && "text-blue font-semibold",
                isSel && "bg-blue text-white font-semibold",
              )}
              aria-pressed={isSel}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
