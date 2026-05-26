"use client";

import { type BeforeInstallPromptEvent, captureInstallPrompt } from "@/lib/install/prompt";
import { useEffect } from "react";

export function InstallPromptCapture() {
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      captureInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  return null;
}
