/**
 * dispatch_push — sends pending Web Push notifications from scheduled_notifications.
 *
 * Invoke on a schedule (e.g. every minute via pg_cron or Supabase cron jobs):
 *   POST https://<project>.supabase.co/functions/v1/dispatch_push
 *
 * Required secrets (set via `supabase secrets set`):
 *   VAPID_PUBLIC_KEY   — VAPID public key (same value as NEXT_PUBLIC_VAPID_PUBLIC_KEY)
 *   VAPID_PRIVATE_KEY  — VAPID private key
 *   VAPID_SUBJECT      — mailto: or https: contact URI
 */

// deno-lint-ignore-file no-explicit-any
// @deno-types="npm:@types/web-push@3"
import webpush from "npm:web-push";
import { createClient } from "jsr:@supabase/supabase-js@2";

const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const vapidSubject = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@example.com";

if (vapidPublic && vapidPrivate) {
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
}

const db = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

Deno.serve(async (_req: Request): Promise<Response> => {
  if (!vapidPublic || !vapidPrivate) {
    return json({ error: "VAPID keys not configured" }, 500);
  }

  // claim_pending_notifications atomically transitions matching rows from
  // 'pending' → 'processing' (FOR UPDATE SKIP LOCKED), so concurrent
  // invocations never claim the same row and can't double-deliver.
  const { data: notifications, error: fetchErr } = await db.rpc("claim_pending_notifications", {
    batch_size: 50,
  });

  if (fetchErr) return json({ error: fetchErr.message }, 500);

  const stats = { sent: 0, failed: 0, skipped: 0, errors: 0 };

  for (const notif of notifications ?? []) {
    const { data: subs, error: subsErr } = await db
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", notif.user_id);

    if (subsErr) {
      console.error("[dispatch_push] fetch subscriptions error:", subsErr.message);
      stats.errors++;
      continue;
    }

    if (subs.length === 0) {
      await db
        .from("scheduled_notifications")
        .update({ status: "cancelled", sent_at: new Date().toISOString() })
        .eq("id", notif.id);
      stats.skipped++;
      continue;
    }

    let sentCount = 0;
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(notif.payload),
        );
        sentCount++;
      } catch (err: any) {
        // 404/410 = subscription expired — remove it to avoid future noise
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await db.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
        console.error("[dispatch_push] send error:", err?.message ?? err);
      }
    }

    await db
      .from("scheduled_notifications")
      .update({
        status: sentCount > 0 ? "sent" : "failed",
        sent_at: new Date().toISOString(),
        attempts: (notif.attempts ?? 0) + 1,
      })
      .eq("id", notif.id);

    if (sentCount > 0) stats.sent++;
    else stats.failed++;
  }

  return json(stats);
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
