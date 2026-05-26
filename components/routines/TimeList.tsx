"use client";

import { format12h } from "@/lib/time/reminder-time";
import { cn } from "@/lib/utils";

type TimeListProps = {
  times: string[];
  onChange: (times: string[]) => void;
};

export function TimeList({ times, onChange }: TimeListProps) {
  const update = (index: number, value: string) => {
    const next = [...times];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(times.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...times, "09:00"]);
  };

  return (
    <div className="flex flex-col gap-2">
      {times.map((t, i) => (
        <div
          key={`time-${
            // biome-ignore lint/suspicious/noArrayIndexKey: order is meaningful here
            i
          }`}
          className="flex items-center justify-between bg-card rounded-lg border border-hair px-[18px] py-3.5"
        >
          <div>
            <div className="text-caption text-ink-2">Notification {i + 1}</div>
            <div className="text-body-lg text-ink tabular-nums mt-0.5">{format12h(t)}</div>
          </div>
          <div className="flex items-center gap-3">
            {times.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove time ${i + 1}`}
                className="w-7 h-7 rounded-full bg-track flex items-center justify-center text-ink-3 text-meta"
              >
                ×
              </button>
            )}
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
                value={t}
                onChange={(e) => update(i, e.target.value)}
                aria-label={`Time ${i + 1}`}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg border border-dashed border-hair text-meta text-blue font-semibold"
      >
        + Add time
      </button>
    </div>
  );
}
