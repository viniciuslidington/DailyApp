"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

const signInSchema = signUpSchema;

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function signUp(formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp(parsed.data);
  if (error) {
    if (error.message.toLowerCase().includes("registered")) {
      return { ok: false, error: "Email already in use. Try signing in." };
    }
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: "Wrong email or password." };
  return { ok: true };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const preferencesSchema = z.object({
  display_name: z.string().min(1, "Name is required.").max(40),
  default_reminder_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM."),
  timezone: z.string().min(1),
});

export async function savePreferences(
  input: z.infer<typeof preferencesSchema>,
): Promise<ActionResult> {
  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    display_name: parsed.data.display_name,
    default_reminder_time: parsed.data.default_reminder_time,
    timezone: parsed.data.timezone,
    onboarding_completed: false, // flipped to true by completeOnboarding
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function completeOnboarding(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("user_preferences")
    .update({ onboarding_completed: true })
    .eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function recordNotificationPermission(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const { error } = await supabase
    .from("user_preferences")
    .update({ notification_permission_granted_at: new Date().toISOString() })
    .eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
