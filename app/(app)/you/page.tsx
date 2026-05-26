import { NotificationToggle } from "@/components/shared/NotificationToggle";
import { signOut } from "@/lib/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function YouPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: authData }, { data: prefs }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("user_preferences").select("display_name, timezone").maybeSingle(),
  ]);

  const displayName = prefs?.display_name || authData.user?.email?.split("@")[0] || "User";
  const initials =
    displayName
      .split(" ")
      .map((w: string) => w[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-24 px-6"
      style={{ paddingTop: "var(--space-18)" }}
    >
      <h1 className="text-h2 text-ink font-bold mb-6">You</h1>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-20 h-20 rounded-full bg-blue-soft flex items-center justify-center">
          <span className="text-title text-blue font-bold">{initials}</span>
        </div>
        <div className="text-center">
          <p className="text-h2 text-ink font-semibold">{displayName}</p>
          <p className="text-body text-ink-3">{authData.user?.email ?? ""}</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-card rounded-2xl border border-hair divide-y divide-hair mb-4">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <p className="text-body text-ink-2">Timezone</p>
          <p className="text-body text-ink font-medium">{prefs?.timezone ?? "UTC"}</p>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <p className="text-body text-ink-2">Notifications</p>
          <NotificationToggle />
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-card rounded-2xl border border-hair">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full h-[54px] flex items-center justify-center text-body-lg text-orange font-medium"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
