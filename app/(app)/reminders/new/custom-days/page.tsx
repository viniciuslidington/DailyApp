"use client";

import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const DAY_OPTIONS = [0, 1, 2, 3, 5, 7, 14] as const;

const DAY_LABELS: Record<(typeof DAY_OPTIONS)[number], string> = {
  0: "On the day",
  1: "1 day before",
  2: "2 days before",
  3: "3 days before",
  5: "5 days before",
  7: "1 week before",
  14: "2 weeks before",
};

export default function CR3bPage() {
  const router = useRouter();
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const setScheduleCustom = useReminderDraft((s) => s.setScheduleCustom);

  const selectedDays = new Set(customOffsets.map((o) => o.days));

  const toggle = (days: number) => {
    if (selectedDays.has(days)) {
      if (selectedDays.size === 1) return;
      setScheduleCustom(customOffsets.filter((o) => o.days !== days));
    } else {
      const next = [...customOffsets, { days, time: "09:00" }].sort((a, b) => b.days - a.days);
      setScheduleCustom(next);
    }
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={5}
          title="How many days in advance?"
          sub="Pick one or more notification days."
          back="/reminders/new/schedule"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-2">
        {DAY_OPTIONS.map((d) => {
          const selected = selectedDays.has(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              aria-pressed={selected}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3.5 rounded-base bg-card border-[1.5px] transition-colors",
                selected ? "border-blue" : "border-hair",
              )}
            >
              <span className={cn("text-body-lg", selected && "font-semibold text-ink")}>
                {DAY_LABELS[d]}
              </span>
              <span
                className={cn(
                  "w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors shrink-0",
                  selected ? "bg-blue border-blue" : "border-mute",
                )}
              >
                {selected && <CheckIcon />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          disabled={selectedDays.size === 0}
          onClick={() => router.push("/reminders/new/custom-times")}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
      <title>Selected</title>
      <path
        d="M1 4l3 3 5-6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
