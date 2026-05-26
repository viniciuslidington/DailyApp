"use client";

import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { PRESET_LABELS, SCHEDULE_PRESETS, type SchedulePreset } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PRESET_DESCRIPTIONS: Record<SchedulePreset, string> = {
  on_day: "Notified on the day of the event",
  day_before: "Notified the evening before",
  three_days: "Notified 3 days ahead",
  week_before: "Notified a full week ahead",
};

export default function CR3Page() {
  const router = useRouter();
  const scheduleKind = useReminderDraft((s) => s.scheduleKind);
  const preset = useReminderDraft((s) => s.preset);
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const setSchedulePreset = useReminderDraft((s) => s.setSchedulePreset);
  const setScheduleCustom = useReminderDraft((s) => s.setScheduleCustom);

  const handleContinue = () => {
    router.push(
      scheduleKind === "custom" ? "/reminders/new/custom-days" : "/reminders/new/message",
    );
  };

  const selectCustom = () => {
    const offsets = customOffsets.length > 0 ? customOffsets : [{ days: 0, time: "09:00" }];
    setScheduleCustom(offsets);
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={5}
          title="When should we notify you?"
          sub="Choose a preset or build a custom schedule."
          back="/reminders/new/when"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {SCHEDULE_PRESETS.map((p) => {
          const selected = scheduleKind === "preset" && preset === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setSchedulePreset(p)}
              aria-pressed={selected}
              className={cn(
                "w-full rounded-2xl bg-card border-[1.5px] px-4 py-4 text-left transition-colors",
                selected ? "border-blue" : "border-hair",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-body-lg font-semibold text-ink">{PRESET_LABELS[p]}</span>
                {selected && (
                  <span className="w-5 h-5 rounded-full bg-blue flex items-center justify-center shrink-0">
                    <CheckIcon />
                  </span>
                )}
              </div>
              <p className="text-body text-ink-2 mt-0.5">{PRESET_DESCRIPTIONS[p]}</p>
            </button>
          );
        })}

        <button
          type="button"
          onClick={selectCustom}
          aria-pressed={scheduleKind === "custom"}
          className={cn(
            "w-full rounded-2xl bg-card border-[1.5px] px-4 py-4 text-left transition-colors",
            scheduleKind === "custom" ? "border-blue" : "border-hair",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-semibold text-ink">Custom</span>
            {scheduleKind === "custom" && (
              <span className="w-5 h-5 rounded-full bg-blue flex items-center justify-center shrink-0">
                <CheckIcon />
              </span>
            )}
          </div>
          <p className="text-body text-ink-2 mt-0.5">Choose specific days and times</p>
        </button>
      </div>
      <div className="px-6 pb-3.5">
        <Button variant="primary" onClick={handleContinue}>
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
