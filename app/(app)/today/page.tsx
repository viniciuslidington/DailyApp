import { RoutineCheckButton } from "@/components/routines/RoutineCheckButton";
import { REMINDER_TYPE_VISUALS, type ReminderType } from "@/lib/reminders/schema";
import type { RoutineType } from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { describeDaysUntil, format12h } from "@/lib/time/reminder-time";
import { addDays } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import Link from "next/link";

const ROUTINE_BORDER_COLORS: Record<RoutineType, string> = {
  drink_water: "border-blue",
  stretch: "border-purple",
  read: "border-orange",
  walk: "border-success",
  meditate: "border-purple",
  custom: "border-mute",
};

export default async function TodayPage() {
  const supabase = await createSupabaseServerClient();

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("display_name, timezone")
    .maybeSingle();

  const tz = prefs?.timezone ?? "UTC";
  const now = new Date();
  const zonedNow = toZonedTime(now, tz);
  const todayDow = zonedNow.getDay();
  const logDate = formatInTimeZone(now, tz, "yyyy-MM-dd");
  const todayLabel = formatInTimeZone(now, tz, "EEEE, MMMM d");
  const hour = zonedNow.getHours();
  const greeting = hour < 12 ? "Morning," : hour < 18 ? "Afternoon," : "Evening,";

  const day60Start = formatInTimeZone(addDays(now, -59), tz, "yyyy-MM-dd");

  const [{ data: allRoutines }, { data: logs }, { data: reminders }, { data: streakLogs }] =
    await Promise.all([
      supabase
        .from("routines")
        .select("id, title, routine_type, times_of_day, days_of_week")
        .eq("active", true),
      supabase
        .from("routine_logs")
        .select("routine_id")
        .eq("log_date", logDate)
        .eq("completed", true),
      supabase
        .from("reminders")
        .select("id, title, reminder_type, event_date, timezone")
        .gte("event_date", now.toISOString())
        .order("event_date")
        .limit(5),
      supabase
        .from("routine_logs")
        .select("log_date")
        .gte("log_date", day60Start)
        .lte("log_date", logDate)
        .eq("completed", true),
    ]);

  const streakSet = new Set(streakLogs?.map((l) => l.log_date) ?? []);
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const dayStr = formatInTimeZone(addDays(now, -i), tz, "yyyy-MM-dd");
    if (i === 0 && !streakSet.has(dayStr)) continue;
    if (streakSet.has(dayStr)) streak++;
    else break;
  }

  const todayRoutines = (allRoutines ?? []).filter((r) =>
    (r.days_of_week as number[]).includes(todayDow),
  );
  const doneSet = new Set((logs ?? []).map((l) => l.routine_id));
  const upcomingReminders = reminders ?? [];

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-36 px-6"
      style={{ paddingTop: "var(--space-18)" }}
    >
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-caption text-ink-3 mb-0.5">{todayLabel}</p>
        <h1 className="text-title text-ink">
          {greeting}
          {prefs?.display_name ? ` ${prefs.display_name}` : ""}
        </h1>
        {streak > 0 && (
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "var(--color-orange-soft)" }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: "var(--color-orange)" }}
            >
              {streak}
            </span>
            <span className="text-body font-semibold" style={{ color: "var(--color-orange)" }}>
              day streak
            </span>
          </div>
        )}
      </div>

      {/* Today's Routines */}
      <section className="mb-6">
        <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide mb-3">Today</p>
        {todayRoutines.length === 0 ? (
          <div className="bg-card rounded-2xl border border-hair px-4 py-5 text-center">
            <p className="text-body text-ink-3">No routines today</p>
            <Link
              href="/routines/new"
              className="text-caption text-blue font-medium mt-1 inline-block"
            >
              Add a routine
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {todayRoutines.map((r) => {
              const type = r.routine_type as RoutineType;
              const isDone = doneSet.has(r.id);
              const times = (r.times_of_day as string[]).map((t) => format12h(t)).join(" · ");
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 bg-card rounded-2xl border border-hair px-4 py-3.5"
                >
                  <RoutineCheckButton
                    routineId={r.id}
                    logDate={logDate}
                    isDone={isDone}
                    borderColorClass={ROUTINE_BORDER_COLORS[type]}
                  />
                  <Link href={`/routines/${r.id}`} className="flex-1 min-w-0">
                    <p
                      className={`text-body-lg font-medium truncate ${isDone ? "line-through text-ink-3" : "text-ink"}`}
                    >
                      {r.title}
                    </p>
                    <p className="text-caption text-ink-3">{times}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide">
              Reminders
            </p>
            <Link href="/reminders/new" className="text-caption text-blue font-medium">
              + New
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingReminders.map((reminder) => {
              const vis =
                REMINDER_TYPE_VISUALS[reminder.reminder_type as ReminderType] ??
                REMINDER_TYPE_VISUALS.task;
              return (
                <Link
                  key={reminder.id}
                  href={`/reminders/${reminder.id}`}
                  className="flex items-center gap-3 bg-card rounded-2xl border border-hair px-4 py-3.5"
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold shrink-0 ${vis.tintClass}`}
                  >
                    {vis.icon}
                  </span>
                  <p className="flex-1 text-body-lg font-medium text-ink truncate min-w-0">
                    {reminder.title}
                  </p>
                  <p className="text-caption text-ink-3 shrink-0">
                    {describeDaysUntil(reminder.event_date, reminder.timezone)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
