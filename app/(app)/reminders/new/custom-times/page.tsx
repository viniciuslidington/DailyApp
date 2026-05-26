"use client";

import { TimePicker } from "@/components/reminders/TimePicker";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import type { CustomOffset } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { format12h } from "@/lib/time/reminder-time";
import { cn } from "@/lib/utils";
import { addDays, format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

const MAX_TIMES_PER_DAY = 3;

function offsetLabel(days: number): string {
  if (days === 0) return "Day of the event";
  if (days === 1) return "1 day before";
  return `${days} days before`;
}

export default function CR3cPage() {
  const router = useRouter();
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const eventDate = useReminderDraft((s) => s.eventDate);
  const setScheduleCustom = useReminderDraft((s) => s.setScheduleCustom);

  // Group offsets by days value, sorted descending (furthest first)
  const grouped: Map<number, string[]> = new Map();
  for (const o of customOffsets) {
    const existing = grouped.get(o.days) ?? [];
    existing.push(o.time);
    grouped.set(o.days, existing);
  }
  const sortedDays = [...grouped.keys()].sort((a, b) => b - a);

  const totalNotifications = customOffsets.length;
  const maxNotifications = sortedDays.length * MAX_TIMES_PER_DAY;

  const addTime = (days: number) => {
    const times = grouped.get(days) ?? [];
    if (times.length >= MAX_TIMES_PER_DAY) return;
    const next: CustomOffset[] = [...customOffsets, { days, time: "09:00" }];
    setScheduleCustom(next);
  };

  const removeTime = (days: number, idx: number) => {
    const timesForDay = grouped.get(days) ?? [];
    // Only allow removal if more than 1 time for that day
    if (timesForDay.length <= 1) return;
    let count = 0;
    const next: CustomOffset[] = [];
    for (const o of customOffsets) {
      if (o.days === days) {
        if (count === idx) {
          count++;
          continue;
        }
        count++;
      }
      next.push(o);
    }
    setScheduleCustom(next);
  };

  const updateTime = (days: number, idx: number, time: string) => {
    let count = 0;
    const next: CustomOffset[] = customOffsets.map((o) => {
      if (o.days === days) {
        if (count === idx) {
          count++;
          return { ...o, time };
        }
        count++;
      }
      return o;
    });
    setScheduleCustom(next);
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={5}
          title="Set times for each day"
          sub="Up to 3 notifications per day."
          back="/reminders/new/custom-days"
        />
      </div>

      {/* Total notifications header */}
      <div className="px-6 mb-3 flex items-center gap-2">
        <span className="text-body text-ink-2">Total notifications</span>
        <span className="px-2 h-5 rounded-full bg-track flex items-center">
          <span className="text-caption text-ink-2 font-medium tabular-nums">
            {totalNotifications} / {maxNotifications}
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {sortedDays.map((days) => {
          const times = grouped.get(days) ?? [];
          const eventDay = addDays(parseISO(eventDate), -days);
          const dayAbbrev = format(eventDay, "EEE");
          const dateNum = format(eventDay, "d");
          const monthDay = format(eventDay, "MMM d");
          const label = offsetLabel(days);
          const canAdd = times.length < MAX_TIMES_PER_DAY;

          return (
            <div key={days} className="bg-card rounded-2xl border border-hair overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-hair">
                <div className="flex items-baseline gap-2">
                  <span className="text-caption text-ink-3">{dayAbbrev}</span>
                  <span className="text-h2 font-bold text-ink leading-none">{dateNum}</span>
                  <span className="text-caption text-ink-3">
                    {monthDay} · {label}
                  </span>
                </div>
                <span className="px-2 h-5 rounded-full bg-track flex items-center shrink-0">
                  <span className="text-caption text-ink-2 font-medium tabular-nums">
                    {times.length}/3
                  </span>
                </span>
              </div>

              {/* Time chips */}
              <div className="px-4 py-3 flex flex-col gap-2">
                {times.map((time, idx) => (
                  <div key={`${days}-${idx}`} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-body-lg font-medium text-ink tabular-nums">
                        {format12h(time)}
                      </span>
                      {times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTime(days, idx)}
                          aria-label={`Remove ${format12h(time)}`}
                          className="w-[18px] h-[18px] rounded-full bg-track flex items-center justify-center shrink-0"
                        >
                          <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden>
                            <title>Remove time</title>
                            <path
                              d="M1 1l5 5M6 1L1 6"
                              stroke="var(--color-ink-3)"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <label className="relative shrink-0">
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-sm bg-blue-soft text-blue text-meta font-semibold cursor-pointer",
                        )}
                      >
                        Change
                      </span>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTime(days, idx, e.target.value)}
                        aria-label={`Change time for ${label}`}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                ))}

                {/* Add time button */}
                {canAdd && (
                  <button
                    type="button"
                    onClick={() => addTime(days)}
                    className="flex items-center gap-2 mt-1"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-soft flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <title>Add time</title>
                        <path
                          d="M5 1v8M1 5h8"
                          stroke="var(--color-blue)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="text-body text-blue font-medium">Add time</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 pb-3.5">
        <Button variant="primary" onClick={() => router.push("/reminders/new/message")}>
          Save schedule
        </Button>
      </div>
    </main>
  );
}

// Keep TimePicker import used above for type consistency
void TimePicker;
