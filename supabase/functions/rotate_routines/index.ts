/**
 * rotate_routines — generates scheduled_notifications for active routines
 * whose next occurrence is tomorrow (in each routine's own timezone).
 *
 * Run once per day, e.g. at 00:05 UTC via pg_cron or Supabase cron jobs:
 *   POST https://<project>.supabase.co/functions/v1/rotate_routines
 *
 * Optional query param:
 *   ?date=YYYY-MM-DD  — override the target date (for testing / backfill)
 *
 * Inserts are idempotent: ON CONFLICT (source_type, source_id, send_at) DO NOTHING,
 * so re-running for the same date is safe.
 */

import { formatInTimeZone, fromZonedTime } from "npm:date-fns-tz@3";
import { addDays } from "npm:date-fns@3";
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const dateOverride = url.searchParams.get("date"); // YYYY-MM-DD

  const { data: routines, error } = await db
    .from("routines")
    .select("id, user_id, title, days_of_week, times_of_day, timezone")
    .eq("active", true);

  if (error) return json({ error: error.message }, 500);

  const now = new Date();
  let generated = 0;

  for (const routine of routines ?? []) {
    const tz = routine.timezone as string;
    // Target date: tomorrow in the routine's timezone (or the override)
    const targetDate = dateOverride ?? formatInTimeZone(addDays(now, 1), tz, "yyyy-MM-dd");
    const targetDow = new Date(`${targetDate}T12:00:00Z`).getUTCDay(); // 0=Sun…6=Sat

    if (!(routine.days_of_week as number[]).includes(targetDow)) continue;

    const payload = {
      title: routine.title as string,
      body: "Time for your routine",
      url: `/routines/${routine.id}`,
      tag: `routine:${routine.id}:${targetDate}`,
    };

    for (const rawTime of routine.times_of_day as string[]) {
      // Normalize HH:MM:SS → HH:MM (Postgres TIME[] can include seconds)
      const time = (rawTime as string).slice(0, 5);
      // Convert the wall-clock instant (targetDate + time in tz) to UTC
      const sendAt = fromZonedTime(`${targetDate}T${time}:00`, tz).toISOString();

      const { error: insertErr } = await db.from("scheduled_notifications").insert({
        user_id: routine.user_id,
        source_type: "routine",
        source_id: routine.id,
        send_at: sendAt,
        payload,
        status: "pending",
        attempts: 0,
      });

      // unique_notification_per_send_at violation → already scheduled, skip silently
      if (!insertErr || insertErr.code === "23505") {
        if (!insertErr) generated++;
      } else {
        console.error("[rotate_routines] insert error:", insertErr.message);
      }
    }
  }

  return json({ generated });
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
