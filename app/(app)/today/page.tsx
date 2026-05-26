import { RoutineCheckButton } from "@/components/routines/RoutineCheckButton";
import { REMINDER_TYPE_VISUALS, type ReminderType } from "@/lib/reminders/schema";
import {
  ROUTINE_ICONS,
  ROUTINE_ICON_COLORS,
  ROUTINE_TINTS,
  type RoutineType,
} from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { describeDaysUntil, format12h } from "@/lib/time/reminder-time";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import Link from "next/link";

export default async function TodayPage() {
  const supabase = await createSupabaseServerClient();

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("display_name, timezone")
    .single();

  const tz = prefs?.timezone ?? "UTC";
  const zonedNow = toZonedTime(new Date(), tz);
  const todayDow = zonedNow.getDay();
  const logDate = formatInTimeZone(new Date(), tz, "yyyy-MM-dd");
  const todayLabel = formatInTimeZone(new Date(), tz, "EEEE, MMMM d");
  const hour = zonedNow.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [{ data: allRoutines }, { data: logs }, { data: reminders }] = await Promise.all([
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
      .gte("event_date", new Date().toISOString())
      .order("event_date")
      .limit(5),
  ]);

  const todayRoutines = (allRoutines ?? []).filter((r) =>
    (r.days_of_week as number[]).includes(todayDow),
  );
  const doneSet = new Set((logs ?? []).map((l) => l.routine_id));

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-24 px-6"
      style={{ paddingTop: "var(--space-18)" }}
    >
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-caption text-ink-3 mb-0.5">{todayLabel}</p>
        <h1 className="text-title text-ink">
          {greeting}
          {prefs?.display_name ? `, ${prefs.display_name}` : ""}!
        </h1>
      </div>

      {/* Today's Routines */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide">Routines</p>
          <Link href="/routines/new" className="text-caption text-blue font-medium">
            + New
          </Link>
        </div>
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
              const times = (r.times_of_day as string[]).map((t) => format12h(t)).join(" · ");
              return (
                <div
                  key={r.id}
                  className="flex items-center bg-card rounded-2xl border border-hair"
                >
                  <Link
                    href={`/routines/${r.id}`}
                    className="flex items-center gap-3 flex-1 px-4 py-3.5 min-w-0"
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${ROUTINE_TINTS[type]} ${ROUTINE_ICON_COLORS[type]}`}
                    >
                      {ROUTINE_ICONS[type]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-body-lg font-medium text-ink truncate">{r.title}</p>
                      <p className="text-caption text-ink-3">{times}</p>
                    </div>
                  </Link>
                  <div className="pr-4">
                    <RoutineCheckButton
                      routineId={r.id}
                      logDate={logDate}
                      isDone={doneSet.has(r.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Reminders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide">Reminders</p>
          <Link href="/reminders/new" className="text-caption text-blue font-medium">
            + New
          </Link>
        </div>
        {(reminders ?? []).length === 0 ? (
          <div className="bg-card rounded-2xl border border-hair px-4 py-5 text-center">
            <p className="text-body text-ink-3">No upcoming reminders</p>
            <Link
              href="/reminders/new"
              className="text-caption text-blue font-medium mt-1 inline-block"
            >
              Add a reminder
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {(reminders ?? []).map((reminder) => {
              const vis = REMINDER_TYPE_VISUALS[reminder.reminder_type as ReminderType];
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
        )}
      </section>
    </main>
  );
}
