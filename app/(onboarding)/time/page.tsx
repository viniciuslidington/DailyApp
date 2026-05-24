"use client";

import { type TimeValue, TimeWheelPicker } from "@/components/onboarding/TimeWheelPicker";
import { Button } from "@/components/shared/Button";
import { ProgressDots } from "@/components/shared/ProgressDots";
import { useOnboardingDraft } from "@/lib/store/onboarding";
import { useRouter } from "next/navigation";
import { useState } from "react";

function toDisplay(hour24: number, minute: number): TimeValue {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour = ((hour24 + 11) % 12) + 1; // 1-12
  return { hour, minute, period };
}

function to24h(value: TimeValue): { hour: number; minute: number } {
  const base = value.hour === 12 ? 0 : value.hour;
  return { hour: value.period === "PM" ? base + 12 : base, minute: value.minute };
}

export default function TimePage() {
  const router = useRouter();
  // Select primitives separately — selectors that return a new object literal
  // each render trip React's "getSnapshot should be cached" warning and can
  // loop in dev. The initial value is only read once via lazy init.
  const storedHour = useOnboardingDraft((s) => s.reminderHour);
  const storedMinute = useOnboardingDraft((s) => s.reminderMinute);
  const setReminderTime = useOnboardingDraft((s) => s.setReminderTime);
  const [value, setValue] = useState<TimeValue>(() => toDisplay(storedHour, storedMinute));

  const onContinue = () => {
    const { hour, minute } = to24h(value);
    setReminderTime(hour, minute);
    router.push("/notifications");
  };

  return (
    <main
      className="absolute inset-0 flex flex-col bg-bg"
      style={{ padding: "var(--space-18) var(--space-10) 0" }}
    >
      <div className="mb-6">
        <ProgressDots index={2} />
      </div>
      <h1 className="text-display text-ink mb-1.5">When should we remind you?</h1>
      <p className="text-body text-ink-2 mb-7">Pick a time that fits your routine.</p>

      <TimeWheelPicker value={value} onChange={setValue} />

      <div className="mt-5 px-4 py-3.5 rounded-base bg-orange-soft text-orange-ink text-meta leading-snug flex gap-2.5 items-start">
        <span
          aria-hidden
          className="w-[22px] h-[22px] rounded-full bg-orange text-white flex items-center justify-center text-meta font-bold flex-shrink-0"
        >
          ☀
        </span>
        <span>Mornings work best for most people — you can change this anytime.</span>
      </div>

      <div className="flex-1" />
      <div className="pb-3.5">
        <Button variant="primary" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </main>
  );
}
