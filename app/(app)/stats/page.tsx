import {
  ROUTINE_ICONS,
  ROUTINE_ICON_COLORS,
  ROUTINE_TINTS,
  type RoutineType,
} from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { subDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const DOW_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export default async function StatsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: prefs } = await supabase.from("user_preferences").select("timezone").single();

  const tz = prefs?.timezone ?? "UTC";

  const days7 = Array.from({ length: 7 }, (_, i) =>
    formatInTimeZone(subDays(new Date(), 6 - i), tz, "yyyy-MM-dd"),
  );

  const [{ data: routines }, { data: logs }] = await Promise.all([
    supabase
      .from("routines")
      .select("id, title, routine_type, days_of_week")
      .eq("active", true)
      .order("created_at"),
    supabase
      .from("routine_logs")
      .select("routine_id, log_date")
      .gte("log_date", days7[0])
      .eq("completed", true),
  ]);

  const logsByRoutine: Record<string, Set<string>> = {};
  for (const log of logs ?? []) {
    const entry = logsByRoutine[log.routine_id];
    if (!entry) {
      logsByRoutine[log.routine_id] = new Set([log.log_date]);
    } else {
      entry.add(log.log_date);
    }
  }

  const totalCompletions = logs?.length ?? 0;
  const activeCount = (routines ?? []).length;

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-24 px-6"
      style={{ paddingTop: "var(--space-18)" }}
    >
      <h1 className="text-h2 text-ink font-bold mb-1">Stats</h1>
      <p className="text-caption text-ink-3 mb-6">Last 7 days</p>

      {activeCount === 0 ? (
        <div className="bg-card rounded-2xl border border-hair px-4 py-8 text-center">
          <p className="text-body text-ink-3">No active routines yet.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-card rounded-2xl border border-hair px-4 py-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-3">Total completions</p>
              <p className="text-h2 text-ink font-bold">{totalCompletions}</p>
            </div>
            <div className="text-right">
              <p className="text-caption text-ink-3">Active routines</p>
              <p className="text-h2 text-ink font-bold">{activeCount}</p>
            </div>
          </div>

          {/* Per-routine grids */}
          <div className="flex flex-col gap-3">
            {(routines ?? []).map((r) => {
              const type = r.routine_type as RoutineType;
              const routineLogs = logsByRoutine[r.id] ?? new Set<string>();
              const doneThisWeek = routineLogs.size;

              return (
                <div key={r.id} className="bg-card rounded-2xl border border-hair px-4 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${ROUTINE_TINTS[type]} ${ROUTINE_ICON_COLORS[type]}`}
                    >
                      {ROUTINE_ICONS[type]}
                    </span>
                    <p className="text-body font-semibold text-ink flex-1 min-w-0 truncate">
                      {r.title}
                    </p>
                    <p className="text-caption text-ink-3 shrink-0">{doneThisWeek}/7</p>
                  </div>

                  <div className="flex justify-between">
                    {days7.map((day) => {
                      const dow = new Date(`${day}T12:00:00Z`).getUTCDay() as number;
                      const isScheduled = (r.days_of_week as number[]).includes(dow);
                      const isDone = routineLogs.has(day);
                      return (
                        <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                          <span className="text-[9px] text-ink-3" title={DOW_FULL[dow]}>
                            {DOW_LABELS[dow]}
                          </span>
                          {isScheduled ? (
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-[1.5px]",
                                isDone ? "bg-success border-success" : "border-mute",
                              )}
                            />
                          ) : (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-track" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
