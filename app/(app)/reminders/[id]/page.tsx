import { TYPE_VISUALS } from "@/components/reminders/TypeChip";
import { deleteReminderAction, markReminderDoneAction } from "@/lib/reminders/actions";
import { toUserFriendlyMessage } from "@/lib/reminders/format";
import {
  type CustomOffset,
  type ReminderType,
  type SchedulePreset,
  readSchedule,
} from "@/lib/reminders/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  format12h,
  formatEventDate,
  formatEventTime,
  timeUntilEvent,
} from "@/lib/time/reminder-time";
import { addDays, format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

// ── helpers ────────────────────────────────────────────────────────────────

const PRESET_OFFSETS: Record<SchedulePreset, Array<{ days: number; time: string }>> = {
  on_day: [{ days: 0, time: "09:00" }],
  day_before: [
    { days: 1, time: "09:00" },
    { days: 0, time: "09:00" },
  ],
  three_days: [
    { days: 3, time: "09:00" },
    { days: 1, time: "09:00" },
    { days: 0, time: "09:00" },
  ],
  week_before: [
    { days: 7, time: "09:00" },
    { days: 3, time: "09:00" },
    { days: 0, time: "09:00" },
  ],
};

function scheduleLabel(
  type: "preset" | "custom",
  config: { preset?: SchedulePreset; offsets?: CustomOffset[] },
): string {
  if (type === "preset") {
    const labels: Record<SchedulePreset, string> = {
      on_day: "On the day only",
      day_before: "Day before",
      three_days: "3 days ahead",
      week_before: "1 week ahead",
    };
    return labels[config.preset!];
  }
  const offsets = config.offsets ?? [];
  const days = new Set(offsets.map((o) => o.days));
  if (days.size === 3 && days.has(3) && days.has(1) && days.has(0)) {
    return "3 days · 1 day · day of";
  }
  const sorted = [...offsets].sort((a, b) => b.days - a.days);
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
  return `Custom · ${offsets.length} pings`;
}

type TimelineDot = {
  date: Date;
  dayLabel: string;
  timeLabel: string | null;
  kind: "notification" | "muted" | "event";
};

function buildTimeline(
  type: "preset" | "custom",
  config: { preset?: SchedulePreset; offsets?: CustomOffset[] },
  eventDate: string,
  timezone: string,
): TimelineDot[] {
  const eventDay = parseISO(eventDate);
  const eventTimeLabel = formatInTimeZone(new Date(eventDate), timezone, "h:mm a");

  const notifOffsets: Array<{ days: number; time: string }> =
    type === "preset" ? PRESET_OFFSETS[config.preset!] : (config.offsets ?? []);

  if (notifOffsets.length === 0) return [];

  const maxOffset = Math.max(...notifOffsets.map((o) => o.days));
  const notifMap = new Map(notifOffsets.map((o) => [o.days, o.time]));

  const dots: TimelineDot[] = [];
  for (let d = maxOffset; d >= 0; d--) {
    const date = addDays(eventDay, -d);
    const dayLabel = format(date, "EEE");
    if (d === 0) {
      dots.push({ date, dayLabel, timeLabel: eventTimeLabel, kind: "event" });
    } else if (notifMap.has(d)) {
      dots.push({ date, dayLabel, timeLabel: format12h(notifMap.get(d)!), kind: "notification" });
    } else {
      dots.push({ date, dayLabel, timeLabel: null, kind: "muted" });
    }
  }
  return dots;
}

// ── page ───────────────────────────────────────────────────────────────────

export default async function ReminderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: reminder } = await supabase.from("reminders").select("*").eq("id", id).single();
  if (!reminder) notFound();

  const schedule = readSchedule(reminder);
  const typeVisual = TYPE_VISUALS[reminder.reminder_type as ReminderType] ?? {
    icon: "◆",
    label: reminder.reminder_type as string,
    tintClass: "bg-blue",
  };
  const eventIso = reminder.event_date as string;
  const tz = reminder.timezone as string;

  const { days: daysLeft, hours: hoursLeft } = timeUntilEvent(eventIso);
  const isPast = daysLeft === 0 && hoursLeft === 0;

  const schedConfig =
    schedule.type === "preset"
      ? { preset: schedule.config.preset }
      : { offsets: schedule.config.offsets };

  const label = scheduleLabel(schedule.type, schedConfig);
  const timeline = buildTimeline(schedule.type, schedConfig, eventIso, tz);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      {/* Header */}
      <div
        style={{ paddingTop: "var(--space-18)" }}
        className="px-5 pb-3 flex items-center justify-between shrink-0"
      >
        <Link
          href="/today"
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
        >
          <BackChevron />
        </Link>
        <h1 className="text-body-lg font-semibold text-ink">Reminder</h1>
        <Link
          href={`/reminders/${id}/edit`}
          aria-label="More options"
          className="w-9 h-9 flex items-center justify-center"
        >
          <DotsIcon />
        </Link>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {/* Card 1 — Blue gradient hero */}
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

          <h2 className="text-h2 font-bold text-white leading-snug mb-1">{reminder.title}</h2>

          <p className="text-body text-white/70 mb-4">
            {formatEventDate(eventIso, tz)}
            <span className="mx-1.5">·</span>
            {formatEventTime(eventIso, tz)}
          </p>

          {/* Countdown chip */}
          {!isPast && (
            <div
              className="flex items-center justify-between rounded-2xl px-4 py-2.5"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              <span className="text-caption text-white/70 font-medium">Time until event</span>
              <span className="flex items-baseline gap-1 text-white">
                {daysLeft > 0 && (
                  <>
                    <span className="text-body-lg font-bold">{daysLeft}</span>
                    <span className="text-caption font-medium mr-2">days</span>
                  </>
                )}
                {hoursLeft > 0 && (
                  <>
                    <span className="text-body-lg font-bold">{hoursLeft}</span>
                    <span className="text-caption font-medium">hours</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Card 2 — Notification message */}
        {reminder.message ? (
          <div className="bg-card rounded-3xl border border-hair px-5 py-4">
            <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider mb-2">
              Notification message
            </p>
            <p className="text-body text-ink leading-snug">
              {toUserFriendlyMessage(reminder.message)}
            </p>
          </div>
        ) : null}

        {/* Card 3 — Settings rows */}
        <div className="bg-card rounded-3xl border border-hair divide-y divide-hair overflow-hidden">
          {/* Schedule */}
          <Link href={`/reminders/${id}/edit`} className="flex items-center gap-3.5 px-4 h-[58px]">
            <span className="w-8 h-8 rounded-xl bg-blue-soft flex items-center justify-center shrink-0 text-blue">
              <ClockIcon />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-caption text-ink-3 leading-none mb-0.5">Schedule</p>
              <p className="text-body font-medium text-ink truncate">{label}</p>
            </div>
            <SmallChevron />
          </Link>

          {/* Sound */}
          <div className="flex items-center gap-3.5 px-4 h-[58px]">
            <span className="w-8 h-8 rounded-xl bg-purple-soft flex items-center justify-center shrink-0 text-purple">
              <MusicIcon />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-caption text-ink-3 leading-none mb-0.5">Sound</p>
              <p className="text-body font-medium text-ink">Chime</p>
            </div>
            <SmallChevron />
          </div>

          {/* Edit details */}
          <Link href={`/reminders/${id}/edit`} className="flex items-center gap-3.5 px-4 h-[58px]">
            <span className="w-8 h-8 rounded-xl bg-orange-soft flex items-center justify-center shrink-0 text-orange">
              <PencilIcon />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-caption text-ink-3 leading-none mb-0.5">Edit details</p>
              <p className="text-body font-medium text-ink">Title, date, message</p>
            </div>
            <SmallChevron />
          </Link>
        </div>

        {/* Card 4 — Upcoming pings */}
        {timeline.length > 0 && (
          <div className="bg-card rounded-3xl border border-hair px-5 py-4">
            <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider mb-4">
              Upcoming pings
            </p>

            <div className="relative flex items-start justify-between px-0.5">
              {/* Connecting line */}
              <div
                className="absolute left-0 right-0 h-[1.5px] bg-track"
                style={{ top: 7 }}
                aria-hidden
              />
              {timeline.map((dot, i) => (
                <div
                  key={`${dot.dayLabel}-${i}`}
                  className="flex flex-col items-center gap-1.5 z-10 flex-1"
                >
                  <div
                    className="rounded-full shrink-0"
                    style={{
                      width: dot.kind === "event" ? 14 : 8,
                      height: dot.kind === "event" ? 14 : 8,
                      background:
                        dot.kind === "event"
                          ? "var(--color-orange)"
                          : dot.kind === "notification"
                            ? "var(--color-blue)"
                            : "var(--color-track)",
                    }}
                  />
                  <span
                    className="text-[10px] font-semibold leading-none"
                    style={{
                      color: dot.kind === "event" ? "var(--color-orange)" : "var(--color-ink-3)",
                    }}
                  >
                    {dot.dayLabel}
                  </span>
                  <span className="text-[10px] leading-none text-ink-3 text-center">
                    {dot.timeLabel ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="shrink-0 px-4 pb-4 pt-2 flex gap-3">
        {/* Delete */}
        <form action={deleteReminderAction} className="flex-1">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="w-full h-[54px] rounded-2xl bg-card border border-hair flex items-center justify-center gap-2 text-body font-semibold"
            style={{ color: "var(--color-orange)" }}
          >
            <TrashIcon />
            Delete
          </button>
        </form>

        {/* Mark as done */}
        <form action={markReminderDoneAction} className="flex-[2]">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="w-full h-[54px] rounded-2xl text-white text-body font-semibold flex items-center justify-center"
            style={{ background: "var(--color-blue)" }}
          >
            Mark as done
          </button>
        </form>
      </div>
    </main>
  );
}

// ── icons ──────────────────────────────────────────────────────────────────

function BackChevron() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden>
      <title>Back</title>
      <path
        d="M7 1L1 7l6 6"
        stroke="var(--color-ink-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="4" viewBox="0 0 18 4" fill="none" aria-hidden>
      <title>More options</title>
      <circle cx="2" cy="2" r="2" fill="var(--color-ink-3)" />
      <circle cx="9" cy="2" r="2" fill="var(--color-ink-3)" />
      <circle cx="16" cy="2" r="2" fill="var(--color-ink-3)" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <title>Schedule</title>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5v3l2 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <title>Sound</title>
      <path
        d="M6 12.5V4l7-1.5V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4.5" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11.5" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <title>Edit</title>
      <path
        d="M11 2l3 3-8 8H3v-3l8-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmallChevron() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden>
      <title>Open</title>
      <path
        d="M1 1l4 4-4 4"
        stroke="var(--color-ink-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <title>Delete</title>
      <path
        d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
