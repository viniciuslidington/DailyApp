"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type PushSubscribeResult = {
  permission: NotificationPermission;
  /** True iff a push subscription is registered server-side after this call. */
  subscribed: boolean;
  /** Present when permission was granted but subscription failed (e.g. iOS not installed,
   *  missing VAPID key, transient pushManager error). Caller decides whether to surface. */
  subscriptionError?: string;
};

/**
 * Requests notification permission and, on grant, registers a Web Push
 * subscription, persisting it to `push_subscriptions`. Never throws —
 * subscription failures are returned in `subscriptionError` so onboarding
 * can continue past this step.
 *
 * - Requires the service worker to be installed (Serwist registers it).
 * - VAPID public key must be exposed as NEXT_PUBLIC_VAPID_PUBLIC_KEY.
 * - On iOS PWA, push only works if the user has Added to Home Screen.
 */
export async function requestAndSubscribe(): Promise<PushSubscribeResult> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { permission: "denied", subscribed: false };
  }

  let permission: NotificationPermission;
  try {
    permission = await Notification.requestPermission();
  } catch (e) {
    return {
      permission: "default",
      subscribed: false,
      subscriptionError: errorMessage(e),
    };
  }
  if (permission !== "granted") return { permission, subscribed: false };

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    return {
      permission,
      subscribed: false,
      subscriptionError: "Push not configured (missing VAPID key).",
    };
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return {
      permission,
      subscribed: false,
      subscriptionError: "This browser doesn't support push notifications.",
    };
  }

  try {
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
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        endpoint: subscription.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
        user_agent: navigator.userAgent,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );
    if (error) {
      return { permission, subscribed: false, subscriptionError: error.message };
    }
    return { permission, subscribed: true };
  } catch (e) {
    return { permission, subscribed: false, subscriptionError: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Couldn't register for push notifications.";
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
