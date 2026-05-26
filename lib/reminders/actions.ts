"use server";

import { type ReminderInput, reminderInputSchema } from "@/lib/reminders/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

export async function createReminder(input: ReminderInput): Promise<ActionResult<{ id: string }>> {
  const parsed = reminderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid reminder." };
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase
    .from("reminders")
    .insert({ user_id: user.id, ...parsed.data })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't save." };

  revalidatePath("/today");
  revalidatePath("/all");
  return { ok: true, data: { id: data.id } };
}

export async function updateReminder(id: string, input: ReminderInput): Promise<ActionResult> {
  const parsed = reminderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid reminder." };
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // Bump updated_at explicitly — the trigger only fires on column updates we
  // care about, and the column default isn't refreshed automatically.
  const { error } = await supabase
    .from("reminders")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/today");
  revalidatePath("/all");
  revalidatePath(`/reminders/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteReminderAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("reminders").delete().eq("id", id);
  revalidatePath("/today");
  revalidatePath("/all");
  redirect("/today");
}
