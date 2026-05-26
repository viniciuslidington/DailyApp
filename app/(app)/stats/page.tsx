import { createSupabaseServerClient } from "@/lib/supabase/server";
import { startOfMonth, subDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const DOW_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export default async function StatsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: prefs } = await supabase.from("user_preferences").select("timezone").maybeSingle();
  const tz = prefs?.timezone ?? "UTC";

  const todayStr = formatInTimeZone(new Date(), tz, "yyyy-MM-dd");
  const days7 = Array.from({ length: 7 }, (_, i) =>
    formatInTimeZone(subDays(new Date(), 6 - i), tz, "yyyy-MM-dd"),
  );
  const day60Start = formatInTimeZone(subDays(new Date(), 59), tz, "yyyy-MM-dd");
  const day365Start = formatInTimeZone(subDays(new Date(), 364), tz, "yyyy-MM-dd");
  const monthStart = formatInTimeZone(startOfMonth(new Date()), tz, "yyyy-MM-dd");

  const [{ data: routines }, { data: allLogs }, { data: yearLogs }, { data: monthlyLogs }] =
    await Promise.all([
      supabase
        .from("routines")
        .select("id, days_of_week, times_of_day")
        .eq("active", true)
        .order("created_at"),
      supabase
        .from("routine_logs")
        .select("routine_id, log_date")
        .gte("log_date", day60Start)
        .lte("log_date", todayStr)
        .eq("completed", true),
      supabase
        .from("routine_logs")
        .select("log_date")
        .gte("log_date", day365Start)
        .lte("log_date", todayStr)
        .eq("completed", true),
      supabase
        .from("routine_logs")
        .select("routine_id, log_date, completed_at")
        .gte("log_date", monthStart)
        .lte("log_date", todayStr)
        .eq("completed", true),
    ]);

  // Per-day completion counts (60d)
  const logsPerDay: Record<string, number> = {};
  for (const log of allLogs ?? []) {
    logsPerDay[log.log_date] = (logsPerDay[log.log_date] ?? 0) + 1;
  }

  // Current streak: consecutive completed days going backwards, skipping today if empty
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const dayStr = formatInTimeZone(subDays(new Date(), i), tz, "yyyy-MM-dd");
    if (i === 0 && !(logsPerDay[dayStr] ?? 0)) continue;
    if ((logsPerDay[dayStr] ?? 0) > 0) {
      streak++;
    } else {
      break;
    }
  }

  // Best streak (365d)
  const yearDoneSet = new Set(yearLogs?.map((l) => l.log_date) ?? []);
  let bestStreak = 0;
  let tempStreak = 0;
  for (let i = 364; i >= 0; i--) {
    const dayStr = formatInTimeZone(subDays(new Date(), i), tz, "yyyy-MM-dd");
    if (yearDoneSet.has(dayStr)) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  bestStreak = Math.max(bestStreak, streak);

  // 7-day bar chart
  const barData = days7.map((day) => {
    const dow = new Date(`${day}T12:00:00Z`).getUTCDay();
    const scheduled = (routines ?? []).filter((r) =>
      (r.days_of_week as number[]).includes(dow),
    ).length;
    const done = logsPerDay[day] ?? 0;
    return { day, dow, scheduled, done, ratio: scheduled > 0 ? Math.min(done / scheduled, 1) : 0 };
  });

  const totalDone7 = barData.reduce((sum, d) => sum + d.done, 0);
  const totalScheduled7 = barData.reduce((sum, d) => sum + d.scheduled, 0);
  const completionPct = totalScheduled7 > 0 ? Math.round((totalDone7 / totalScheduled7) * 100) : 0;

  // Monthly done count
  const monthCount = monthlyLogs?.length ?? 0;

  // On-time: completed_at within 10 min of scheduled times_of_day[0]
  const routineTimeMap = new Map(
    (routines ?? []).map((r) => [r.id, (r.times_of_day as string[])[0] ?? null]),
  );
  const onTimeCount =
    monthlyLogs?.filter((log) => {
      const completedAt = log.completed_at;
      if (!completedAt) return false;
      const firstTime = routineTimeMap.get(log.routine_id);
      if (!firstTime) return false;
      const scheduledUtc = fromZonedTime(`${log.log_date}T${firstTime}`, tz);
      const diffMin = Math.abs(new Date(completedAt).getTime() - scheduledUtc.getTime()) / 60_000;
      return diffMin <= 10;
    }).length ?? 0;
  const onTimePct = monthCount > 0 ? Math.round((onTimeCount / monthCount) * 100) : 0;

  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-36 px-4"
      style={{ paddingTop: "var(--space-18)" }}
    >
      {/* Page header */}
      <div className="px-2 mb-5">
        <h1 className="text-h2 text-ink font-bold">Your progress</h1>
        <p className="text-body text-ink-3 mt-0.5">Last 7 days · keep it up.</p>
      </div>

      {/* Streak hero */}
      <div
        className="rounded-3xl px-6 py-5 mb-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-end) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption font-semibold text-white/70 uppercase tracking-wider mb-2">
              Current streak
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-[52px] font-bold text-white leading-none">{streak}</p>
              <p className="text-body-lg font-semibold text-white/90">days</p>
            </div>
            <p className="text-body text-white/70 mt-1">Best: {bestStreak} days</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <SunIcon />
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="bg-card rounded-3xl border border-hair px-5 py-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide">This week</p>
          <p className="text-body font-bold text-ink">
            {completionPct}
            <span className="text-caption font-semibold text-ink-3">%</span>
          </p>
        </div>
        <div className="flex items-end justify-between gap-2" style={{ height: 110 }}>
          {barData.map(({ day, dow, ratio }) => {
            const isToday = day === todayStr;
            const barH = ratio > 0 ? Math.max(ratio * 80, 8) : 4;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className="w-full rounded-xl"
                  style={{
                    height: barH,
                    background: isToday ? "var(--color-orange)" : "var(--color-blue)",
                    opacity: ratio > 0 ? 0.35 + ratio * 0.65 : 0.15,
                  }}
                />
                <span className="text-[10px] text-ink-3">{DOW_LABELS[dow]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-3xl border border-hair px-4 py-5">
          <p className="text-caption text-ink-3 font-semibold uppercase tracking-wide mb-2">Done</p>
          <p className="text-[40px] font-bold text-blue leading-none">{monthCount}</p>
          <p className="text-caption text-ink-3 mt-1.5">reminders this month</p>
        </div>
        <div className="bg-card rounded-3xl border border-hair px-4 py-5">
          <p className="text-caption text-ink-3 font-semibold uppercase tracking-wide mb-2">
            On time
          </p>
          <p className="text-[40px] font-bold text-orange leading-none">{onTimePct}%</p>
          <p className="text-caption text-ink-3 mt-1.5">within 10 min</p>
        </div>
      </div>
    </main>
  );
}

function SunIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <title>Streak</title>
      <circle cx="15" cy="15" r="6" fill="white" />
      <line x1="15" y1="1" x2="15" y2="5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line
        x1="15"
        y1="25"
        x2="15"
        y2="29"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="1" y1="15" x2="5" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line
        x1="25"
        y1="15"
        x2="29"
        y2="15"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="4.4"
        y1="4.4"
        x2="7.2"
        y2="7.2"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="22.8"
        y1="22.8"
        x2="25.6"
        y2="25.6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="25.6"
        y1="4.4"
        x2="22.8"
        y2="7.2"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="7.2"
        y1="22.8"
        x2="4.4"
        y2="25.6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
