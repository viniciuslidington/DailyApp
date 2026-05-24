import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Root() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/welcome");

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("onboarding_completed")
    .eq("user_id", user.id)
    .maybeSingle();

  redirect(prefs?.onboarding_completed ? "/today" : "/name");
}
