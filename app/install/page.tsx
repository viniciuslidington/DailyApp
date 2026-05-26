"use client";

import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Platform = "ios" | "android" | "other";
type State = "checking" | "promptable" | "manual";

export default function InstallPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("other");
  const [state, setState] = useState<State>("checking");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      router.replace("/today");
      return;
    }

    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setPlatform("ios");
      setState("manual");
    } else if (/Android/i.test(ua)) {
      setPlatform("android");
      setState("manual");
    } else {
      setPlatform("other");
      setState("manual");
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState("promptable");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [router]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") router.replace("/today");
    else setState("manual");
  };

  if (state === "checking") return null;

  return (
    <main
      className="absolute inset-0 flex flex-col bg-card px-8"
      style={{ paddingTop: "var(--space-30)", paddingBottom: "var(--space-9)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Logo size={80} />
        <div className="text-center">
          <h1 className="text-title text-ink font-bold mb-2">Add Daily to your home screen</h1>
          <p className="text-body text-ink-3 leading-relaxed">
            Instant launch, works offline, and notifications that actually arrive.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {state === "promptable" ? (
          <Button onClick={handleInstall}>Add to Home Screen</Button>
        ) : platform === "ios" ? (
          <div className="bg-bg rounded-2xl border border-hair p-5">
            <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide mb-4">
              On iPhone or iPad
            </p>
            <div className="flex flex-col gap-3.5">
              <Step n={1}>
                Tap the <strong className="text-ink font-semibold">Share</strong> button at the
                bottom of Safari
              </Step>
              <Step n={2}>
                Scroll down and tap{" "}
                <strong className="text-ink font-semibold">Add to Home Screen</strong>
              </Step>
              <Step n={3}>
                Tap <strong className="text-ink font-semibold">Add</strong> to confirm
              </Step>
            </div>
          </div>
        ) : (
          <div className="bg-bg rounded-2xl border border-hair p-5">
            <p className="text-caption font-semibold text-ink-3 uppercase tracking-wide mb-4">
              In your browser
            </p>
            <div className="flex flex-col gap-3.5">
              <Step n={1}>
                Open the browser menu <strong className="text-ink font-semibold">(⋮ or ···)</strong>
              </Step>
              <Step n={2}>
                Tap <strong className="text-ink font-semibold">Add to Home Screen</strong> or{" "}
                <strong className="text-ink font-semibold">Install app</strong>
              </Step>
              <Step n={3}>Confirm to install</Step>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/today")}
          className="text-body text-ink-3 py-2 text-center"
        >
          Continue in browser
        </button>
      </div>
    </main>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-blue-soft text-blue text-caption font-semibold flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <p className="text-body text-ink-2 flex-1 leading-snug">{children}</p>
    </div>
  );
}
