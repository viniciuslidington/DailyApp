import { REMINDER_TYPE_VISUALS, type ReminderType } from "@/lib/reminders/schema";
import {
  ROUTINE_ICONS,
  ROUTINE_ICON_COLORS,
  ROUTINE_TINTS,
  type RoutineType,
  formatDaysOfWeek,
} from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/time/reminder-time";
import Link from "next/link";

type Filter = "upcoming" | "routines" | "done";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "routines", label: "Routines" },
  { value: "done", label: "Done" },
];

export default async function AllPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter: Filter = rawFilter === "routines" || rawFilter === "done" ? rawFilter : "upcoming";

  const supabase = await createSupabaseServerClient();

  const now = new Date().toISOString();

  const [{ data: routines }, { data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("routines")
      .select("id, title, routine_type, days_of_week")
      .eq("active", true)
      .order("created_at"),
    filter !== "done"
      ? supabase
          .from("reminders")
          .select("id, title, reminder_type, event_date, timezone")
          .gte("event_date", now)
          .order("event_date")
      : Promise.resolve({ data: [] }),
    filter === "done"
      ? supabase
          .from("reminders")
          .select("id, title, reminder_type, event_date, timezone")
          .lt("event_date", now)
          .order("event_date", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
  ]);

  const reminders = filter === "done" ? (past ?? []) : (upcoming ?? []);
  const showRoutines = filter !== "done";
  const showReminders = filter !== "routines";

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-36 px-4"
      style={{ paddingTop: "var(--space-18)" }}
    >
      <h1 className="text-h2 text-ink font-bold mb-4 px-2">All</h1>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 px-2">
        {FILTERS.map(({ value, label }) => (
          <Link
            key={value}
            href={value === "upcoming" ? "/all" : `/all?filter=${value}`}
            className={
              filter === value
                ? "px-4 h-8 rounded-full bg-ink text-white text-caption font-semibold flex items-center"
                : "px-4 h-8 rounded-full bg-card border border-hair text-caption font-medium text-ink-2 flex items-center"
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Routines */}
      {showRoutines && (
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide">
              Routines
            </p>
            <Link href="/routines/new" className="text-caption text-blue font-medium">
              + New
            </Link>
          </div>
          {(routines ?? []).length === 0 ? (
            <div className="bg-card rounded-2xl border border-hair px-4 py-5 text-center">
              <p className="text-body text-ink-3">No routines yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {(routines ?? []).map((r) => {
                const type = r.routine_type as RoutineType;
                return (
                  <Link
                    key={r.id}
                    href={`/routines/${r.id}`}
                    className="flex items-center gap-3 bg-card rounded-2xl border border-hair px-4 py-3.5"
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${ROUTINE_TINTS[type]} ${ROUTINE_ICON_COLORS[type]}`}
                    >
                      {ROUTINE_ICONS[type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-lg font-medium text-ink truncate">{r.title}</p>
                      <p className="text-caption text-ink-3">
                        {formatDaysOfWeek(r.days_of_week as number[])}
                      </p>
                    </div>
                    <ChevronRight />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Reminders */}
      {showReminders && (
        <section>
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide">
              {filter === "done" ? "Past reminders" : "Reminders"}
            </p>
            {filter !== "done" && (
              <Link href="/reminders/new" className="text-caption text-blue font-medium">
                + New
              </Link>
            )}
          </div>
          {reminders.length === 0 ? (
            <div className="bg-card rounded-2xl border border-hair px-4 py-5 text-center">
              <p className="text-body text-ink-3">
                {filter === "done" ? "No past reminders" : "No upcoming reminders"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {reminders.map((reminder) => {
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
                    <div className="min-w-0 flex-1">
                      <p className="text-body-lg font-medium text-ink truncate">{reminder.title}</p>
                      <p className="text-caption text-ink-3">
                        {formatEventDate(reminder.event_date, reminder.timezone)}
                      </p>
                    </div>
                    <ChevronRight />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function ChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden>
      <title>Open</title>
      <path
        d="M1 1l5 5-5 5"
        stroke="var(--color-ink-3)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
