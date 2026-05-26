"use server";

import { type RoutineInput, routineInputSchema } from "@/lib/routines/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

export async function createRoutine(input: RoutineInput): Promise<ActionResult<{ id: string }>> {
  const parsed = routineInputSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid routine." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase
    .from("routines")
    .insert({ user_id: user.id, ...parsed.data })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't save." };

  revalidatePath("/today");
  revalidatePath("/all");
  return { ok: true, data: { id: data.id } };
}

export async function updateRoutine(id: string, input: RoutineInput): Promise<ActionResult> {
  const parsed = routineInputSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid routine." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("routines")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/today");
  revalidatePath("/all");
  revalidatePath(`/routines/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteRoutineAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from("routines").delete().eq("id", id).eq("user_id", user.id);
  if (error) return;
  revalidatePath("/today");
  revalidatePath("/all");
  redirect("/today");
}

export async function toggleRoutineLog(
  routineId: string,
  logDate: string,
  currentlyDone: boolean,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  if (currentlyDone) {
    const { error } = await supabase
      .from("routine_logs")
      .delete()
      .eq("routine_id", routineId)
      .eq("log_date", logDate)
      .eq("user_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("routine_logs").upsert(
      {
        routine_id: routineId,
        user_id: user.id,
        log_date: logDate,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "routine_id,log_date" },
    );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(`/routines/${routineId}`);
  revalidatePath("/today");
  return { ok: true, data: undefined };
}
