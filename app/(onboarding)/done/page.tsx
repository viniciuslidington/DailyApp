"use client";

import { Button } from "@/components/shared/Button";
import { completeOnboarding } from "@/lib/auth/actions";
import { useOnboardingDraft } from "@/lib/store/onboarding";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DonePage() {
  const router = useRouter();
  const reset = useOnboardingDraft((s) => s.reset);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onOpen = () => {
    setError(null);
    startTransition(async () => {
      const r = await completeOnboarding();
      if (!r.ok) {
        setError(r.error);
        return;
      }
      reset();
      router.push("/today");
    });
  };

  return (
    <main
      className="absolute inset-0 flex flex-col bg-card"
      style={{ padding: "var(--space-18) var(--space-11) var(--space-9)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-7">
        <div
          className="relative w-[110px] h-[110px] rounded-full bg-blue flex items-center justify-center"
          style={{
            boxShadow: "0 16px 40px rgb(from var(--color-blue) r g b / 0.28)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
            <title>Check</title>
            <path
              d="M12 24l8 8 16-18"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className="absolute -top-1.5 -right-1.5 w-[26px] h-[26px] rounded-full bg-orange"
            style={{ boxShadow: "0 4px 12px rgb(from var(--color-orange) r g b / 0.4)" }}
          />
        </div>
        <h1 className="text-title text-ink text-center">You&apos;re all set</h1>
      </div>
      {error ? (
        <p className="text-caption text-orange mb-3 text-center" role="alert">
          {error}
        </p>
      ) : null}
      <Button variant="primary" onClick={onOpen} loading={pending}>
        Open Daily
      </Button>
    </main>
  );
}
