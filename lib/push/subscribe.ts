"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Requests notification permission and (on grant) registers a Web Push
 * subscription, persisting it to `push_subscriptions`. Resolves with the
 * final permission state regardless of outcome.
 *
 * Notes:
 * - Requires the service worker to be installed (Serwist registers it).
 * - VAPID public key must be exposed as NEXT_PUBLIC_VAPID_PUBLIC_KEY.
 * - On iOS PWA, this only works if the user has Added to Home Screen.
 */
export async function requestAndSubscribe(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    console.warn("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY missing; skipping subscription.");
    return permission;
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return permission;
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    }));

  const supabase = createSupabaseBrowserClient();
  const json = subscription.toJSON();
  await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
      user_agent: navigator.userAgent,
      last_used_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );

  return permission;
}

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(safe);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}
