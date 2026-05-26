import { deleteRoutineAction } from "@/lib/routines/actions";
import {
  ROUTINE_ICONS,
  ROUTINE_ICON_COLORS,
  ROUTINE_LABELS,
  ROUTINE_TINTS,
  type RoutineType,
  formatDaysOfWeek,
} from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { format12h } from "@/lib/time/reminder-time";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkDoneButton } from "./MarkDoneButton";

type Props = { params: Promise<{ id: string }> };

export default async function RoutineDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: routine } = await supabase.from("routines").select("*").eq("id", id).single();
  if (!routine) notFound();

  const logDate = formatInTimeZone(new Date(), routine.timezone, "yyyy-MM-dd");

  const { data: todayLog } = await supabase
    .from("routine_logs")
    .select("id, completed")
    .eq("routine_id", id)
    .eq("log_date", logDate)
    .maybeSingle();

  const type = routine.routine_type as RoutineType;
  const isDoneToday = todayLog?.completed === true;

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div
        style={{ paddingTop: "var(--space-18)" }}
        className="px-6 pb-4 flex items-center justify-between"
      >
        <Link
          href="/today"
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
        >
          <BackChevron />
        </Link>
        <h1 className="text-h2 text-ink">Routine</h1>
        <Link href={`/routines/${id}/edit`} className="text-meta text-blue font-medium">
          Edit
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {/* Title card */}
        <div
          className={`rounded-2xl border border-hair px-4 py-5 flex items-center gap-4 ${ROUTINE_TINTS[type]}`}
        >
          <span
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/60 ${ROUTINE_ICON_COLORS[type]}`}
          >
            {ROUTINE_ICONS[type]}
          </span>
          <div>
            <p className="text-h2 text-ink leading-tight">{routine.title}</p>
            <p className="text-body text-ink-2">{ROUTINE_LABELS[type]}</p>
          </div>
        </div>

        {/* Schedule card */}
        <div className="bg-card rounded-2xl border border-hair px-4 py-4">
          <p className="text-caption text-ink-3 mb-1.5">Schedule</p>
          <p className="text-body-lg text-ink font-medium">
            {formatDaysOfWeek(routine.days_of_week)}
          </p>
          <p className="text-body text-ink-2 mt-0.5">
            {(routine.times_of_day as string[]).map((t) => format12h(t)).join(" · ")}
          </p>
        </div>

        {/* Goal card */}
        {routine.goal_per_week ? (
          <div className="bg-card rounded-2xl border border-hair px-4 py-4">
            <p className="text-caption text-ink-3 mb-1">Weekly goal</p>
            <p className="text-body-lg text-ink">{routine.goal_per_week}× per week</p>
          </div>
        ) : null}

        {/* Today's completion */}
        <div className="bg-card rounded-2xl border border-hair px-4 py-4">
          <p className="text-caption text-ink-3 mb-3">Today</p>
          <MarkDoneButton routineId={id} logDate={logDate} isDone={isDoneToday} />
        </div>
      </div>

      <div className="px-6 pb-3.5">
        <form action={deleteRoutineAction}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="h-[54px] rounded-lg w-full flex items-center justify-center text-body-lg text-orange font-medium"
          >
            Delete routine
          </button>
        </form>
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
