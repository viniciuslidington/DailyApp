import { pauseRoutineAction } from "@/lib/routines/actions";
import {
  ROUTINE_ICONS,
  ROUTINE_TINTS,
  type RoutineType,
  formatDaysOfWeek,
} from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addDays, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogSessionButton } from "./LogSessionButton";

type Props = { params: Promise<{ id: string }> };

// unit label per routine type
const UNIT_LABELS: Record<RoutineType, string> = {
  drink_water: "glass",
  stretch: "session",
  read: "session",
  walk: "walk",
  meditate: "session",
  custom: "session",
};

// goal description per routine type
function goalText(type: RoutineType, remaining: number, total: number): string {
  if (remaining === 0) return "You've hit your daily target!";
  const unit =
    type === "drink_water"
      ? `glass${remaining > 1 ? "es" : ""}`
      : `session${remaining > 1 ? "s" : ""}`;
  return `${remaining} more ${unit} to hit your daily target.`;
}

export default async function RoutineDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: routine } = await supabase.from("routines").select("*").eq("id", id).single();
  if (!routine) notFound();

  const tz = routine.timezone as string;
  const type = routine.routine_type as RoutineType;
  const timesOfDay = routine.times_of_day as string[];
  const totalPerDay = timesOfDay.length;

  const logDate = formatInTimeZone(new Date(), tz, "yyyy-MM-dd");

  // Today's log
  const { data: todayLog } = await supabase
    .from("routine_logs")
    .select("completed")
    .eq("routine_id", id)
    .eq("log_date", logDate)
    .maybeSingle();

  const isDoneToday = todayLog?.completed === true;
  const doneCount = isDoneToday ? totalPerDay : 0;
  const remaining = totalPerDay - doneCount;

  // This week (Mon–Sun) logs
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = formatInTimeZone(date, tz, "yyyy-MM-dd");
    const dow = (i + 1) % 7; // Mon=1…Sun=0
    return { dateStr, dow, dayLabel: ["M", "T", "W", "T", "F", "S", "S"][i] ?? "" };
  });

  const weekStartStr = weekDays[0]?.dateStr ?? logDate;
  const weekEndStr = weekDays[6]?.dateStr ?? logDate;

  const { data: weekLogs } = await supabase
    .from("routine_logs")
    .select("log_date, completed")
    .eq("routine_id", id)
    .gte("log_date", weekStartStr)
    .lte("log_date", weekEndStr)
    .eq("completed", true);

  const completedDates = new Set(weekLogs?.map((l) => l.log_date) ?? []);

  // This week completion %
  const daysOfWeek = routine.days_of_week as number[];
  const scheduledSoFar = weekDays.filter(
    (d) => d.dateStr <= logDate && daysOfWeek.includes(d.dow === 0 ? 0 : d.dow),
  ).length;
  const completedSoFar = weekDays.filter(
    (d) => d.dateStr <= logDate && completedDates.has(d.dateStr),
  ).length;
  const weekPct = scheduledSoFar > 0 ? Math.round((completedSoFar / scheduledSoFar) * 100) : 0;

  // Streak: query 60d logs
  const day60Start = formatInTimeZone(addDays(new Date(), -59), tz, "yyyy-MM-dd");
  const { data: streakLogs } = await supabase
    .from("routine_logs")
    .select("log_date")
    .eq("routine_id", id)
    .gte("log_date", day60Start)
    .lte("log_date", logDate)
    .eq("completed", true);
  const streakSet = new Set(streakLogs?.map((l) => l.log_date) ?? []);
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const dayStr = formatInTimeZone(addDays(new Date(), -i), tz, "yyyy-MM-dd");
    if (i === 0 && !streakSet.has(dayStr)) continue;
    if (streakSet.has(dayStr)) streak++;
    else break;
  }

  // Circular arc params (radius 30, strokeWidth 5)
  const R = 30;
  const circumference = 2 * Math.PI * R;
  const progress = totalPerDay > 0 ? doneCount / totalPerDay : 0;
  const dashOffset = circumference * (1 - progress);

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
        <h1 className="text-body-lg font-semibold text-ink">Habit</h1>
        <Link
          href={`/routines/${id}/edit`}
          aria-label="More options"
          className="w-9 h-9 flex items-center justify-center"
        >
          <DotsIcon />
        </Link>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {/* Hero card */}
        <div
          className="rounded-3xl border-[1.5px] border-blue px-5 pt-5 pb-4"
          style={{ background: "var(--color-glass-fill)" }}
        >
          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${ROUTINE_TINTS[type]}`}
            >
              {ROUTINE_ICONS[type]}
            </span>
            <div>
              <p className="text-body-lg font-bold text-ink leading-snug">{routine.title}</p>
              <p className="text-body text-ink-3">
                {formatDaysOfWeek(daysOfWeek)} · {totalPerDay} time{totalPerDay > 1 ? "s" : ""} a
                day
              </p>
            </div>
          </div>

          {/* Progress row */}
          <div className="flex items-center gap-4 mb-4">
            {/* Circular arc */}
            <div className="relative shrink-0" style={{ width: 70, height: 70 }}>
              <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden>
                <title>Progress</title>
                <circle
                  cx="35"
                  cy="35"
                  r={R}
                  fill="none"
                  stroke="var(--color-track)"
                  strokeWidth="5"
                />
                <circle
                  cx="35"
                  cy="35"
                  r={R}
                  fill="none"
                  stroke="var(--color-blue)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 35 35)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-body-lg font-bold text-ink">{doneCount}</span>
                <span className="text-caption text-ink-3 font-medium">/{totalPerDay}</span>
              </div>
            </div>

            {/* Goal text */}
            <div>
              <p className="text-caption text-ink-3 font-semibold uppercase tracking-wide mb-1">
                Today&apos;s goal
              </p>
              <p className="text-body text-ink leading-snug">
                <span className="font-semibold">{goalText(type, remaining, totalPerDay)}</span>
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {Array.from({ length: totalPerDay }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-7 rounded-lg"
                style={{
                  background: i < doneCount ? "var(--color-blue)" : "var(--color-track)",
                  minWidth: 0,
                  maxWidth: 36,
                }}
              />
            ))}
          </div>

          {/* Log button */}
          <LogSessionButton
            routineId={id}
            logDate={logDate}
            isDone={isDoneToday}
            unitLabel={UNIT_LABELS[type]}
          />
        </div>

        {/* Mini stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-3xl border border-hair px-4 py-4">
            <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider mb-1">
              Streak
            </p>
            <p className="text-[32px] font-bold text-orange leading-none">{streak}</p>
            <p className="text-caption text-ink-3 mt-1">days</p>
          </div>
          <div className="bg-card rounded-3xl border border-hair px-4 py-4">
            <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider mb-1">
              This week
            </p>
            <div className="flex items-baseline gap-0.5">
              <p className="text-[32px] font-bold text-blue leading-none">{weekPct}</p>
              <p className="text-caption font-semibold text-ink-3">%</p>
            </div>
          </div>
        </div>

        {/* This week history */}
        <div className="bg-card rounded-3xl border border-hair px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider">
              This week
            </p>
            <Link href={`/routines/${id}/edit`} className="text-caption text-blue font-semibold">
              View history
            </Link>
          </div>

          <div className="flex items-center justify-between">
            {weekDays.map((day, i) => {
              const isToday = day.dateStr === logDate;
              const isCompleted = completedDates.has(day.dateStr);
              const isFuture = day.dateStr > logDate;
              const isScheduled = daysOfWeek.includes(day.dow === 0 ? 0 : day.dow);

              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  {isToday && !isCompleted ? (
                    // Today partial: outlined circle with count
                    <div
                      className="w-9 h-9 rounded-full border-[1.5px] border-blue flex items-center justify-center"
                      style={{ background: "var(--color-blue-soft)" }}
                    >
                      <span className="text-body font-bold text-blue">{doneCount}</span>
                    </div>
                  ) : isCompleted ? (
                    // Completed: solid blue with checkmark
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "var(--color-blue)" }}
                    >
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden>
                        <title>Done</title>
                        <path
                          d="M1 5.5l4 4L13 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ) : isScheduled && !isFuture ? (
                    // Missed: empty outlined circle
                    <div className="w-9 h-9 rounded-full border-[1.5px] border-track" />
                  ) : (
                    // Future or unscheduled: faint circle
                    <div
                      className="w-9 h-9 rounded-full"
                      style={{ background: "var(--color-track)" }}
                    />
                  )}
                  <span
                    className="text-[11px] font-semibold leading-none"
                    style={{
                      color: isToday ? "var(--color-blue)" : "var(--color-ink-3)",
                      fontWeight: isToday ? 700 : 500,
                    }}
                  >
                    {day.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 px-4 pb-4 pt-2 flex gap-3">
        <form action={pauseRoutineAction} className="flex-1">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="w-full h-[54px] rounded-2xl bg-card border border-hair text-body font-semibold text-ink"
          >
            Pause
          </button>
        </form>
        <Link
          href={`/routines/${id}/edit`}
          className="flex-1 h-[54px] rounded-2xl bg-card border border-hair text-body font-semibold text-ink flex items-center justify-center"
        >
          Edit
        </Link>
      </div>
    </main>
  );
}

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
