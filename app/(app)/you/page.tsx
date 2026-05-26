import { QuietHoursSwitch } from "@/components/shared/QuietHoursSwitch";
import { signOut } from "@/lib/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { format, parse } from "date-fns";

export default async function YouPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: authData }, { data: prefs }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("user_preferences")
      .select("display_name, timezone, default_reminder_time, dark_mode")
      .maybeSingle(),
  ]);

  const displayName = prefs?.display_name || authData.user?.email?.split("@")[0] || "User";
  const initials =
    displayName
      .split(" ")
      .map((w: string) => w[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const rawTime = (prefs?.default_reminder_time as string | null) ?? "09:00:00";
  const defaultTimeLabel = format(parse(rawTime.slice(0, 5), "HH:mm", new Date()), "h:mm a");
  const appearanceLabel = prefs?.dark_mode ? "Dark" : "Light";

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-36 px-4"
      style={{ paddingTop: "var(--space-18)" }}
    >
      <h1 className="text-h2 text-ink font-bold mb-5 px-2">You</h1>

      {/* Profile card */}
      <div className="bg-card rounded-3xl border border-hair px-4 py-4 mb-5 flex items-center gap-3.5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)",
          }}
        >
          <span className="text-[22px] text-white font-bold leading-none">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-lg font-semibold text-ink truncate">{displayName}</p>
          <p className="text-body text-ink-3 truncate">{authData.user?.email ?? ""}</p>
        </div>
        <span className="px-3.5 h-8 rounded-full bg-blue-soft text-blue text-caption font-semibold flex items-center shrink-0">
          Edit
        </span>
      </div>

      {/* REMINDERS */}
      <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider px-2 mb-2">
        Reminders
      </p>
      <div className="bg-card rounded-3xl border border-hair divide-y divide-hair mb-5">
        <Row iconBg="bg-blue" icon={<ClockIcon />} label="Default time" value={defaultTimeLabel} />
        <Row iconBg="bg-purple" icon={<MusicIcon />} label="Sound" value="Chime" />
        <Row
          iconBg="bg-orange"
          icon={<MoonIcon />}
          label="Quiet hours"
          trailing={<QuietHoursSwitch />}
        />
      </div>

      {/* APP */}
      <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider px-2 mb-2">
        App
      </p>
      <div className="bg-card rounded-3xl border border-hair divide-y divide-hair mb-5">
        <Row iconBg="bg-ink" icon={<AppearanceIcon />} label="Appearance" value={appearanceLabel} />
        <Row iconBg="bg-success" icon={<SparkleIcon />} label="Daily Pro" value="Upgrade" />
      </div>

      {/* ACCOUNT */}
      <p className="text-caption text-ink-3 font-semibold uppercase tracking-wider px-2 mb-2">
        Account
      </p>
      <div className="bg-card rounded-3xl border border-hair">
        <form action={signOut}>
          <button type="submit" className="w-full h-[54px] flex items-center gap-3.5 px-4">
            <span className="w-9 h-9 rounded-xl bg-ink-3/20 flex items-center justify-center shrink-0 text-ink-2">
              <SignOutIcon />
            </span>
            <p className="text-body text-ink flex-1 text-left">Sign out</p>
            <ChevronRight />
          </button>
        </form>
      </div>
    </main>
  );
}

function Row({
  iconBg,
  icon,
  label,
  value,
  trailing,
}: {
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="px-4 h-[54px] flex items-center gap-3.5">
      <span
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${iconBg}`}
      >
        {icon}
      </span>
      <p className="text-body text-ink flex-1">{label}</p>
      {value && <p className="text-body text-ink-3 font-medium shrink-0">{value}</p>}
      {trailing}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <title>Clock</title>
      <circle cx="9" cy="9" r="7.5" stroke="white" strokeWidth="1.5" />
      <path
        d="M9 5.5V9l2.5 2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <title>Music</title>
      <path
        d="M7 14V4.5l8-1.5V12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="14" r="2" stroke="white" strokeWidth="1.5" />
      <circle cx="13" cy="12" r="2" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <title>Moon</title>
      <path
        d="M15 10.5A7 7 0 017 2.5a7 7 0 100 13A6.97 6.97 0 0015 10.5z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppearanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <title>Appearance</title>
      <circle cx="9" cy="9" r="7.5" stroke="white" strokeWidth="1.5" />
      <path d="M9 1.5a7.5 7.5 0 010 15V1.5z" fill="white" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <title>Sparkle</title>
      <path
        d="M9 1.5L10.5 7h5.5l-4.5 3.5 1.5 5.5L9 13l-4 3 1.5-5.5L2 7h5.5L9 1.5z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <title>Sign out</title>
      <path
        d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11 11l3-3-3-3M14 8H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden>
      <title>Go</title>
      <path
        d="M1 1l5 5-5 5"
        stroke="var(--color-ink-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
