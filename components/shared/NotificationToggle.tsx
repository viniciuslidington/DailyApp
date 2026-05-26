"use client";

import { recordNotificationPermission } from "@/lib/auth/actions";
import { requestAndSubscribe } from "@/lib/push/subscribe";
import { useEffect, useState } from "react";

type Status = "loading" | "unsupported" | "granted" | "denied" | "default";

export function NotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
    } else {
      setStatus(Notification.permission as Status);
    }
  }, []);

  const enable = async () => {
    setWorking(true);
    try {
      const result = await requestAndSubscribe();
      if (result.permission === "granted") {
        await recordNotificationPermission();
      }
      setStatus(result.permission as Status);
    } finally {
      setWorking(false);
    }
  };

  if (status === "loading") {
    return <span className="text-caption text-ink-3">…</span>;
  }

  if (status === "unsupported") {
    return <span className="text-caption text-ink-3">Not supported</span>;
  }

  if (status === "granted") {
    return <span className="text-caption text-success font-medium">On</span>;
  }

  if (status === "denied") {
    return <span className="text-caption text-ink-3">Blocked</span>;
  }

  return (
    <button
      type="button"
      onClick={enable}
      disabled={working}
      className="text-caption text-blue font-medium disabled:opacity-50"
    >
      {working ? "Enabling…" : "Enable"}
    </button>
  );
}
