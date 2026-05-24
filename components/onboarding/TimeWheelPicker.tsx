"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";

type Period = "AM" | "PM";

export type TimeValue = {
  hour: number; // 1-12 (display); 0-23 stored as 24h externally
  minute: number; // 0-59
  period: Period;
};

type TimeWheelPickerProps = {
  value: TimeValue;
  onChange: (next: TimeValue) => void;
};

const ROW_HEIGHT = 42;

/**
 * Three column wheels (hour / minute / period). Each column is a vertically
 * scrollable list snapped to ROW_HEIGHT; the selected row sits in the middle
 * band (highlighted by a soft blue band drawn behind). Looping is handled by
 * the parent — for MVP we keep the lists finite and let the user drag/scroll.
 */
export function TimeWheelPicker({ value, onChange }: TimeWheelPickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods: Period[] = ["AM", "PM"];

  return (
    <div
      className="relative bg-card border border-hair rounded-2xl p-3"
      style={{ height: 168 + 24 }}
    >
      {/* selection band */}
      <div
        aria-hidden
        className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-12 bg-blue-soft rounded-xl pointer-events-none"
      />
      <div className="relative flex items-center h-full">
        <Column
          values={hours.map((h) => h.toString().padStart(2, "0"))}
          selectedIndex={value.hour - 1}
          onSelect={(idx) => onChange({ ...value, hour: idx + 1 })}
        />
        <div className="text-h3 font-semibold text-ink px-1">:</div>
        <Column
          values={minutes.map((m) => m.toString().padStart(2, "0"))}
          selectedIndex={value.minute}
          onSelect={(idx) => onChange({ ...value, minute: idx })}
        />
        <div className="w-[70px]">
          <Column
            values={periods}
            selectedIndex={value.period === "AM" ? 0 : 1}
            onSelect={(idx) => onChange({ ...value, period: periods[idx] as Period })}
          />
        </div>
      </div>
    </div>
  );
}

type ColumnProps = {
  values: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

function Column({ values, selectedIndex, onSelect }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);
  const settleTimer = useRef<number | null>(null);

  // Scroll to selected on mount + when external value changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: selectedIndex * ROW_HEIGHT, behavior: "auto" });
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    scrollingRef.current = true;
    if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / ROW_HEIGHT);
      const clamped = Math.max(0, Math.min(values.length - 1, idx));
      if (clamped !== selectedIndex) onSelect(clamped);
      el.scrollTo({ top: clamped * ROW_HEIGHT, behavior: "smooth" });
      scrollingRef.current = false;
    }, 120);
  }, [onSelect, selectedIndex, values.length]);

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="flex-1 h-[168px] overflow-y-scroll snap-y snap-mandatory tabular-nums no-scrollbar"
      style={{ scrollPaddingTop: ROW_HEIGHT * 2, scrollPaddingBottom: ROW_HEIGHT * 2 }}
    >
      {/* top padding so the first row can be centered */}
      <div style={{ height: ROW_HEIGHT * 2 }} />
      {values.map((v, i) => {
        const sel = i === selectedIndex;
        return (
          <div
            key={v}
            className={cn(
              "flex items-center justify-center snap-center transition-colors",
              sel ? "text-ink text-3xl font-semibold" : "text-ink-3 text-2xl",
            )}
            style={{ height: ROW_HEIGHT }}
          >
            {v}
          </div>
        );
      })}
      <div style={{ height: ROW_HEIGHT * 2 }} />
    </div>
  );
}
