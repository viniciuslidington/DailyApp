"use client";

import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { cn } from "@/lib/utils";
import { addDays, differenceInCalendarDays, format, parseISO, startOfToday } from "date-fns";
import { useRouter } from "next/navigation";

export default function CR3bPage() {
  const router = useRouter();
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const eventDate = useReminderDraft((s) => s.eventDate);
  const setScheduleCustom = useReminderDraft((s) => s.setScheduleCustom);

  const today = startOfToday();
  const eventDay = parseISO(eventDate);
  const totalDays = differenceInCalendarDays(eventDay, today);
  // Show days from today to event (max 15 rows total: up to 14 before + event)
  const daysToShow = Math.max(0, Math.min(totalDays, 14));

  // Build list of calendar days: today ... event (inclusive)
  const calendarRows: Array<{
    date: Date;
    daysBeforeEvent: number;
    isEvent: boolean;
    isToday: boolean;
  }> = [];

  for (let i = 0; i <= daysToShow; i++) {
    const date = addDays(today, i);
    const daysBeforeEvent = differenceInCalendarDays(eventDay, date);
    calendarRows.push({
      date,
      daysBeforeEvent,
      isEvent: daysBeforeEvent === 0,
      isToday: i === 0,
    });
  }

  // Always treat day=0 (event day) as selected, even if not yet in store
  const hasEventDay = customOffsets.some((o) => o.days === 0);
  const effectiveOffsets = hasEventDay
    ? customOffsets
    : [...customOffsets, { days: 0, time: "09:00" }];
  const selectedDays = new Set(effectiveOffsets.map((o) => o.days));
  const nonEventSelected = effectiveOffsets.filter((o) => o.days !== 0).length;

  const toggle = (daysBeforeEvent: number) => {
    if (daysBeforeEvent === 0) return; // event day always included
    if (selectedDays.has(daysBeforeEvent)) {
      if (nonEventSelected === 1) return; // keep at least 1 notification day besides event
      setScheduleCustom(effectiveOffsets.filter((o) => o.days !== daysBeforeEvent));
    } else {
      const next = [...effectiveOffsets, { days: daysBeforeEvent, time: "09:00" }].sort(
        (a, b) => b.days - a.days,
      );
      setScheduleCustom(next);
    }
  };

  const selectedCount = selectedDays.size;

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={5}
          title="Custom · pick days"
          sub="Choose the days you want to be notified before the event."
          back="/reminders/new/schedule"
        />
      </div>

      {/* Selection counter chip */}
      <div className="px-6 mb-3 flex items-center gap-2">
        <span className="text-body text-ink-2">Days</span>
        <span className="px-2 h-5 rounded-full bg-blue-soft flex items-center">
          <span className="text-caption text-blue font-medium tabular-nums">
            {selectedCount} selected
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-2">
        {calendarRows.map((row) => {
          const isSelected = row.isEvent || selectedDays.has(row.daysBeforeEvent);
          const dayAbbrev = format(row.date, "EEE");
          const dateNum = format(row.date, "d");

          let dateLabel: string;
          if (row.isToday) {
            dateLabel = `Today · ${format(row.date, "MMM d")}`;
          } else if (row.isEvent) {
            dateLabel = `Event · ${format(row.date, "MMM d")}`;
          } else {
            dateLabel = format(row.date, "MMM d");
          }

          let statusText: string;
          if (row.isEvent) {
            statusText = "Day of the meeting";
          } else if (isSelected) {
            statusText = "Will be notified";
          } else {
            statusText = "No notifications";
          }

          return (
            <button
              key={row.daysBeforeEvent}
              type="button"
              onClick={() => toggle(row.daysBeforeEvent)}
              disabled={row.isEvent}
              aria-pressed={isSelected}
              className={cn(
                "w-full rounded-2xl bg-card border-[1.5px] px-4 py-3 text-left transition-colors",
                isSelected ? "border-blue" : "border-hair",
                row.isEvent && "opacity-100 cursor-default",
              )}
            >
              <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-3">
                {/* Left: day abbrev + date number */}
                <div className="flex flex-col items-center">
                  <span className="text-caption text-ink-3 leading-none">{dayAbbrev}</span>
                  <span
                    className={cn(
                      "text-h2 font-bold leading-tight",
                      isSelected && !row.isEvent ? "text-blue" : "text-ink",
                    )}
                  >
                    {dateNum}
                  </span>
                </div>

                {/* Middle: date label + status */}
                <div>
                  <p className="text-body-lg font-medium text-ink leading-snug">{dateLabel}</p>
                  <p
                    className={cn(
                      "text-caption leading-snug",
                      isSelected && !row.isEvent ? "text-blue" : "text-ink-3",
                    )}
                  >
                    {statusText}
                  </p>
                </div>

                {/* Right: toggle or always badge */}
                {row.isEvent ? (
                  <span className="px-2 h-5 rounded-full bg-blue-soft flex items-center shrink-0">
                    <span className="text-caption text-blue font-medium">Always</span>
                  </span>
                ) : (
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-blue border-blue" : "border-mute",
                    )}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                        <title>Selected</title>
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          disabled={selectedCount === 0}
          onClick={() => {
            if (!hasEventDay) setScheduleCustom(effectiveOffsets);
            router.push("/reminders/new/custom-times");
          }}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
