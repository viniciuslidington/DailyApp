"use client";

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

// ── sub-components ─────────────────────────────────────────────────────────

type DotKind = "notification" | "mute" | "event" | "daily";

function TimelineDot({ kind }: { kind: DotKind }) {
  if (kind === "event") {
    return <div className="w-[13px] h-[13px] rounded-full bg-orange shrink-0 z-10" />;
  }
  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full shrink-0 z-10",
        kind === "notification" && "bg-blue",
        kind === "daily" && "bg-orange",
        kind === "mute" && "bg-track",
      )}
    />
  );
}

type TimelineProps = {
  dots: Array<{ kind: DotKind; label: string }>;
};

function Timeline({ dots }: TimelineProps) {
  return (
    <div className="relative flex items-center justify-between mt-3 mb-1 px-0.5">
      {/* connecting line */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-track"
        aria-hidden
      />
      {dots.map((dot, i) => (
        <React.Fragment key={`${dot.label}-${i}`}>
          <div className="flex flex-col items-center gap-1 z-10">
            <TimelineDot kind={dot.kind} />
            <span className="text-[9px] leading-none text-ink-3 mt-0.5">{dot.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="w-5 h-5 rounded-full bg-blue flex items-center justify-center shrink-0">
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
    </span>
  );
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
        <button
          type="button"
          onClick={() => setSchedulePreset("on_day")}
          aria-pressed={isOnDay}
          className={cn(
            "w-full rounded-2xl bg-card border-[1.5px] px-4 pt-4 pb-3 text-left transition-colors",
            isOnDay ? "border-blue" : "border-hair",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-semibold text-ink">On the day only</span>
            {isOnDay ? <CheckBadge /> : <div className="w-5 h-5" />}
          </div>
          <p className="text-body text-ink-2 mt-0.5 mb-1">One ping at the time of the event.</p>
          <Timeline
            dots={[
              { kind: "mute", label: "-3d" },
              { kind: "mute", label: "-2d" },
              { kind: "mute", label: "-1d" },
              { kind: "event", label: "Event" },
            ]}
          />
        </button>

        {/* 3 days · 1 day · day of */}
        <button
          type="button"
          onClick={() => setScheduleCustom(THREE_DAYS_OFFSETS)}
          aria-pressed={isThreeDays}
          className={cn(
            "w-full rounded-2xl bg-card border-[1.5px] px-4 pt-4 pb-3 text-left transition-colors",
            isThreeDays ? "border-blue" : "border-hair",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-semibold text-ink">3 days · 1 day · day of</span>
            {isThreeDays ? <CheckBadge /> : <div className="w-5 h-5" />}
          </div>
          <p className="text-body text-ink-2 mt-0.5 mb-1">
            A heads-up, a reminder, and a final nudge.
          </p>
          <Timeline
            dots={[
              { kind: "notification", label: "-3d" },
              { kind: "mute", label: "-2d" },
              { kind: "notification", label: "-1d" },
              { kind: "event", label: "Event" },
            ]}
          />
        </button>

        {/* Every day until the event */}
        <button
          type="button"
          onClick={() => setScheduleCustom(dailyOffsets(eventDate))}
          aria-pressed={isEveryDay}
          className={cn(
            "w-full rounded-2xl bg-card border-[1.5px] px-4 pt-4 pb-3 text-left transition-colors",
            isEveryDay ? "border-blue" : "border-hair",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-semibold text-ink">Every day until the event</span>
            {isEveryDay ? <CheckBadge /> : <div className="w-5 h-5" />}
          </div>
          <p className="text-body text-ink-2 mt-0.5 mb-1">A daily countdown until the event.</p>
          <Timeline
            dots={[
              { kind: "daily", label: "-5" },
              { kind: "daily", label: "-4" },
              { kind: "daily", label: "-3" },
              { kind: "daily", label: "-2" },
              { kind: "daily", label: "-1" },
              { kind: "event", label: "Event" },
            ]}
          />
        </button>

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
