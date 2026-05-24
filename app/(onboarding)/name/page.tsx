"use client";

import { Button } from "@/components/shared/Button";
import { ProgressDots } from "@/components/shared/ProgressDots";
import { useOnboardingDraft } from "@/lib/store/onboarding";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NamePage() {
  const router = useRouter();
  const stored = useOnboardingDraft((s) => s.displayName);
  const setDisplayName = useOnboardingDraft((s) => s.setDisplayName);
  const [name, setName] = useState(stored ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
    router.push("/time");
  };

  return (
    <main
      className="absolute inset-0 flex flex-col bg-bg"
      style={{ padding: "var(--space-18) var(--space-10) 0" }}
    >
      <div className="mb-6">
        <ProgressDots index={1} />
      </div>
      <h1 className="text-display text-ink mb-1.5">What should we call you?</h1>
      <p className="text-body text-ink-2 mb-7">We&apos;ll use this on your morning greeting.</p>

      <label className="block" htmlFor="display-name">
        <span className="sr-only">Your name</span>
        <span className="bg-card rounded-lg h-16 px-5 flex items-center border-[1.5px] border-blue text-h2">
          <input
            ref={inputRef}
            id="display-name"
            name="display-name"
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3"
            placeholder="Alex"
            maxLength={40}
          />
        </span>
      </label>

      <div className="flex-1" />
      <div className="pb-3.5">
        <Button variant="primary" onClick={onContinue} disabled={!name.trim()}>
          Continue
        </Button>
      </div>
    </main>
  );
}
