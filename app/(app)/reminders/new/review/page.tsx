"use client";

import { TYPE_VISUALS } from "@/components/reminders/TypeChip";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { createReminder } from "@/lib/reminders/actions";
import { toBackendMessage } from "@/lib/reminders/format";
import type { CustomOffset, SchedulePreset } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { formatEventDate, formatEventTime, toUtcIso } from "@/lib/time/reminder-time";
import { cn } from "@/lib/utils";
import { addDays, parseISO } from "date-fns";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── helpers ────────────────────────────────────────────────────────────────

function scheduleLabel(
  scheduleKind: "preset" | "custom",
  preset: SchedulePreset,
  customOffsets: CustomOffset[],
): string {
  if (scheduleKind === "preset") {
    const labels: Record<SchedulePreset, string> = {
      on_day: "On the day only",
      day_before: "Day before",
      three_days: "3 days ahead",
      week_before: "1 week ahead",
    };
    return labels[preset];
  }
  const days = new Set(customOffsets.map((o) => o.days));
  if (days.size === 3 && days.has(3) && days.has(1) && days.has(0)) {
    return "3 days · 1 day · day of";
  }
  const sorted = [...customOffsets].sort((a, b) => b.days - a.days);
  if (sorted.length >= 2 && sorted[sorted.length - 1]?.days === 0) {
    const max = sorted[0]?.days ?? 0;
    let consecutive = true;
    for (let i = 0; i <= max; i++) {
      if (!days.has(i)) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) return "Every day";
  }
  return "Custom";
}

type TimelineDot = { date: Date; kind: "notification" | "muted" | "event" };

function computeTimeline(
  scheduleKind: "preset" | "custom",
  preset: SchedulePreset,
  customOffsets: CustomOffset[],
  eventDate: string,
): TimelineDot[] {
  const eventDay = parseISO(eventDate);

  let notifOffsets: number[];
  if (scheduleKind === "preset") {
    const map: Record<SchedulePreset, number[]> = {
      on_day: [0],
      day_before: [1, 0],
      three_days: [3, 0],
      week_before: [7, 0],
    };
    notifOffsets = map[preset];
  } else {
    notifOffsets = [...new Set(customOffsets.map((o) => o.days))];
  }

  const maxOffset = Math.max(...notifOffsets);
  const notifSet = new Set(notifOffsets);

  const dots: TimelineDot[] = [];
  for (let d = maxOffset; d >= 0; d--) {
    dots.push({
      date: addDays(eventDay, -d),
      kind: d === 0 ? "event" : notifSet.has(d) ? "notification" : "muted",
    });
  }
  return dots;
}

// ── page ───────────────────────────────────────────────────────────────────

export default function CR5Page() {
  const router = useRouter();
  const title = useReminderDraft((s) => s.title);
  const reminderType = useReminderDraft((s) => s.reminderType);
  const eventDate = useReminderDraft((s) => s.eventDate);
  const eventTime = useReminderDraft((s) => s.eventTime);
  const message = useReminderDraft((s) => s.message);
  const scheduleKind = useReminderDraft((s) => s.scheduleKind);
  const preset = useReminderDraft((s) => s.preset);
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const timezone = useReminderDraft((s) => s.timezone);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventDateIso = toUtcIso(eventDate, eventTime, timezone);
      const scheduleConfig = scheduleKind === "preset" ? { preset } : { offsets: customOffsets };

      const result = await createReminder({
        title,
        reminder_type: reminderType,
        event_date: eventDateIso,
        message: toBackendMessage(message),
        schedule_type: scheduleKind,
        schedule_config: scheduleConfig,
        timezone,
      });

      if (result.ok) {
        router.push(`/reminders/new/created?id=${result.data.id}`);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const typeVisual = TYPE_VISUALS[reminderType];
  const eventIso = toUtcIso(eventDate, eventTime, timezone);
  const scheduleSummary = scheduleLabel(scheduleKind, preset, customOffsets);
  const notifCount = scheduleKind === "preset" ? 1 : customOffsets.length;
  const timeline = computeTimeline(scheduleKind, preset, customOffsets, eventDate);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={5}
          total={5}
          title="Ready to set this up?"
          sub="Review your reminder, then save."
          back="/reminders/new/message"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {/* Card 1 — Blue gradient: type + title + date */}
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background:
              "linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)",
            boxShadow: "rgba(47, 107, 255, 0.2) 0px 14px 36px 0px",
          }}
        >
          {/* Type badge */}
          <span className="inline-flex items-center gap-1.5 px-3 h-[22px] rounded-[7px] bg-white/[0.18] text-white text-caption font-semibold mb-3 uppercase tracking-wide">
            <span aria-hidden>{typeVisual.icon}</span>
            {typeVisual.label}
          </span>

          {/* Title */}
          <h2 className="text-h2 font-bold text-white leading-snug mb-1">{title}</h2>

          {/* Date · time */}
          <p className="text-body text-white/70">
            {formatEventDate(eventIso, timezone)}
            <span className="mx-1">·</span>
            {formatEventTime(eventIso, timezone)}
          </p>
        </div>

        {/* Card 2 — White: schedule / notifications / message rows */}
        <div className="bg-card rounded-3xl border border-hair overflow-hidden">
          {/* Schedule row */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-body text-ink-2">Schedule</span>
            <span className="text-body font-medium text-ink text-right">{scheduleSummary}</span>
          </div>

          <div className="border-t border-hair mx-5" />

          {/* Notifications row */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-body text-ink-2">Notifications</span>
            <span className="text-body font-medium text-ink">{notifCount} in total</span>
          </div>

          {message.trim() ? (
            <>
              <div className="border-t border-hair mx-5" />
              {/* Message row */}
              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <span className="text-body text-ink-2 shrink-0">Message</span>
                <p className="text-body text-ink italic text-right leading-snug">
                  &ldquo;{message}&rdquo;
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Card 3 — You'll be pinged timeline */}
        <div className="bg-card rounded-3xl border border-hair px-5 py-4">
          <p className="text-caption text-ink-3 uppercase tracking-wide mb-4">
            You&apos;ll be pinged
          </p>

          {/* Timeline */}
          <div className="relative flex items-center justify-between px-0.5">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-[7px] h-[1.5px] bg-track" aria-hidden />
            {timeline.map((dot, i) => (
              <div key={`dot-${i}`} className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={cn(
                    "rounded-full shrink-0",
                    dot.kind === "event"
                      ? "w-[14px] h-[14px] bg-orange"
                      : dot.kind === "notification"
                        ? "w-2 h-2 bg-blue"
                        : "w-2 h-2 bg-track",
                  )}
                />
                <span className="text-[10px] leading-none text-ink-3">
                  {format(dot.date, "EEE")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error ? <p className="text-caption text-orange text-center px-2">{error}</p> : null}
      </div>
      <div className="px-6 pb-3.5">
        <Button variant="primary" loading={loading} onClick={handleCreate}>
          Save reminder
        </Button>
      </div>
    </main>
  );
}
