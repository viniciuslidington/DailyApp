"use client";

import { recordNotificationPermission } from "@/lib/auth/actions";
import { requestAndSubscribe } from "@/lib/push/subscribe";
import { useEffect, useState } from "react";

export function QuietHoursSwitch() {
  const [granted, setGranted] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setGranted(Notification.permission === "granted");
    }
  }, []);

  const toggle = async () => {
    if (granted) return; // can't revoke permission from JS
    setWorking(true);
    try {
      const result = await requestAndSubscribe();
      if (result.permission === "granted") {
        setGranted(true);
        try {
          await recordNotificationPermission();
        } catch {}
      }
    } finally {
      setWorking(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={granted}
      onClick={toggle}
      disabled={working}
      className="shrink-0 w-[51px] h-[31px] rounded-full transition-colors duration-200 relative"
      style={{ background: granted ? "var(--color-blue)" : "var(--color-track)" }}
    >
      <span
        className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: granted ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}
