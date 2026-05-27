"use client";

import { type DotKind, ScheduleCard } from "@/components/reminders/ScheduleCard";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import type { CustomOffset, SchedulePreset } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { cn } from "@/lib/utils";
import { differenceInCalendarDays, parseISO, startOfToday } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

// ── helpers ────────────────────────────────────────────────────────────────

function daysUntilEvent(eventDate: string): number {
  return differenceInCalendarDays(parseISO(eventDate), startOfToday());
}

function dailyOffsets(eventDate: string): CustomOffset[] {
  const n = Math.min(daysUntilEvent(eventDate), 6);
  const offsets: CustomOffset[] = [];
  for (let d = n; d >= 0; d--) {
    offsets.push({ days: d, time: "09:00" });
  }
  return offsets.length > 0 ? offsets : [{ days: 0, time: "09:00" }];
}

function dailyDots(eventDate: string): Array<{ kind: DotKind; label: string }> {
  const days = daysUntilEvent(eventDate);
  const n = Math.max(1, Math.min(days, 5));
  const dots: Array<{ kind: DotKind; label: string }> = [];
  for (let d = n; d >= 1; d--) {
    dots.push({ kind: "daily", label: `-${d}d` });
  }
  dots.push({ kind: "event", label: "Event" });
  return dots;
}

const THREE_DAYS_OFFSETS: CustomOffset[] = [
  { days: 3, time: "09:00" },
  { days: 1, time: "09:00" },
  { days: 0, time: "09:00" },
];

function isThreeDaysTrack(offsets: CustomOffset[]): boolean {
  const days = new Set(offsets.map((o) => o.days));
  return days.size === 3 && days.has(3) && days.has(1) && days.has(0);
}

function isEveryDayTrack(offsets: CustomOffset[]): boolean {
  if (offsets.length < 2) return false;
  const sorted = [...offsets].sort((a, b) => b.days - a.days);
  if (sorted[sorted.length - 1]?.days !== 0) return false;
  const max = sorted[0]?.days ?? 0;
  for (let i = 0; i <= max; i++) {
    if (!offsets.some((o) => o.days === i)) return false;
  }
  return true;
}

function ChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden>
      <title>Go to custom days</title>
      <path
        d="M1 1l5 5-5 5"
        stroke="var(--color-ink-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── page ───────────────────────────────────────────────────────────────────

export default function CR3Page() {
  const router = useRouter();
  const scheduleKind = useReminderDraft((s) => s.scheduleKind);
  const preset = useReminderDraft((s) => s.preset);
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const eventDate = useReminderDraft((s) => s.eventDate);
  const setSchedulePreset = useReminderDraft((s) => s.setSchedulePreset);
  const setScheduleCustom = useReminderDraft((s) => s.setScheduleCustom);

  const isOnDay = scheduleKind === "preset" && preset === "on_day";
  const isThreeDays = scheduleKind === "custom" && isThreeDaysTrack(customOffsets);
  const isEveryDay = scheduleKind === "custom" && isEveryDayTrack(customOffsets);
  const isCustom = scheduleKind === "custom" && !isThreeDays && !isEveryDay;

  const handleContinue = () => {
    if (isCustom) {
      router.push("/reminders/new/custom-days");
    } else {
      router.push("/reminders/new/message");
    }
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={5}
          title="When should we remind you?"
          sub="Pick a schedule that fits how urgent it feels."
          back="/reminders/new/when"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {/* On the day only */}
        <ScheduleCard
          title="On the day only"
          description="One ping at the time of the event."
          isSelected={isOnDay}
          onClick={() => setSchedulePreset("on_day")}
          dots={[
            { kind: "mute", label: "-3d" },
            { kind: "mute", label: "-2d" },
            { kind: "mute", label: "-1d" },
            { kind: "event", label: "Event" },
          ]}
        />

        {/* 3 days · 1 day · day of */}
        <ScheduleCard
          title="3 days · 1 day · day of"
          description="A heads-up, a reminder, and a final nudge."
          isSelected={isThreeDays}
          onClick={() => setScheduleCustom(THREE_DAYS_OFFSETS)}
          dots={[
            { kind: "notification", label: "-3d" },
            { kind: "mute", label: "-2d" },
            { kind: "notification", label: "-1d" },
            { kind: "event", label: "Event" },
          ]}
        />

        {/* Every day until the event */}
        <ScheduleCard
          title="Every day until the event"
          description="A daily countdown until the event."
          isSelected={isEveryDay}
          onClick={() => setScheduleCustom(dailyOffsets(eventDate))}
          dots={dailyDots(eventDate)}
        />

        {/* Custom… */}
        <button
          type="button"
          onClick={() => router.push("/reminders/new/custom-days")}
          aria-pressed={isCustom}
          className={cn(
            "w-full rounded-2xl bg-card border-[1.5px] px-4 py-4 text-left transition-colors",
            isCustom ? "border-blue" : "border-hair",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-body-lg font-semibold text-ink">Custom…</span>
              <p className="text-body text-ink-2 mt-0.5">Choose your own combination of offsets.</p>
            </div>
            <ChevronRight />
          </div>
        </button>
      </div>
      <div className="px-6 pb-3.5">
        <Button variant="primary" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </main>
  );
}
