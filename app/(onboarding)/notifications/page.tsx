"use client";

import { NotificationPreview } from "@/components/onboarding/NotificationPreview";
import { Button } from "@/components/shared/Button";
import { ProgressDots } from "@/components/shared/ProgressDots";
import { recordNotificationPermission, savePreferences } from "@/lib/auth/actions";
import { requestAndSubscribe } from "@/lib/push/subscribe";
import { useOnboardingDraft } from "@/lib/store/onboarding";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function fmtTime(h: number, m: number) {
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const draft = useOnboardingDraft();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const proceed = (skipPermission: boolean) => {
    setError(null);
    startTransition(async () => {
      // 1. Persist name + time + timezone collected so far.
      if (draft.displayName) {
        const prefs = await savePreferences({
          display_name: draft.displayName,
          default_reminder_time: fmtTime(draft.reminderHour, draft.reminderMinute),
          timezone: draft.timezone,
        });
        if (!prefs.ok) {
          setError(prefs.error);
          return;
        }
      }
      // 2. Optionally request permission + subscribe.
      if (!skipPermission) {
        const perm = await requestAndSubscribe();
        if (perm === "granted") await recordNotificationPermission();
      }
      router.push("/done");
    });
  };

  return (
    <main
      className="absolute inset-0 flex flex-col bg-bg"
      style={{ padding: "var(--space-18) var(--space-10) 0" }}
    >
      <div className="mb-6">
        <ProgressDots index={3} />
      </div>
      <h1 className="text-display text-ink mb-1.5">Turn on reminders</h1>
      <p className="text-body text-ink-2 mb-7">
        Daily lives in your notifications, not your screen time.
      </p>

      <NotificationPreview name={draft.displayName ?? undefined} />

      {error ? (
        <p className="text-caption text-orange mt-3 pl-1" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex-1" />
      <div className="flex flex-col gap-1 pb-3.5">
        <Button variant="orange" loading={pending} onClick={() => proceed(false)}>
          Allow notifications
        </Button>
        <Button variant="ghost" onClick={() => proceed(true)} disabled={pending}>
          Not now
        </Button>
      </div>
    </main>
  );
}
