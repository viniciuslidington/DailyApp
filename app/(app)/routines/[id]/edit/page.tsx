import type { RoutineType } from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditRoutineForm } from "./EditRoutineForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditRoutinePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: routine } = await supabase.from("routines").select("*").eq("id", id).single();

  if (!routine) notFound();

  return (
    <EditRoutineForm
      id={id}
      initial={{
        routineType: routine.routine_type as RoutineType,
        title: routine.title,
        daysOfWeek: routine.days_of_week as number[],
        timesOfDay: routine.times_of_day as string[],
        goalPerWeek: routine.goal_per_week as number | null,
        timezone: routine.timezone,
      }}
    />
  );
}
