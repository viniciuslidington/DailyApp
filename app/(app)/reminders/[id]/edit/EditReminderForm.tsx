"use client";

import { DatePicker } from "@/components/reminders/DatePicker";
import { TimePicker } from "@/components/reminders/TimePicker";
import { TypeChip } from "@/components/reminders/TypeChip";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { updateReminder } from "@/lib/reminders/actions";
import {
  type CustomOffset,
  PRESET_LABELS,
  REMINDER_TYPES,
  type ReminderType,
  SCHEDULE_PRESETS,
  type SchedulePreset,
} from "@/lib/reminders/schema";
import { toUtcIso } from "@/lib/time/reminder-time";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditState = {
  title: string;
  reminderType: ReminderType;
  eventDate: string;
  eventTime: string;
  message: string;
  scheduleKind: "preset" | "custom";
  preset: SchedulePreset;
  customOffsets: CustomOffset[];
  timezone: string;
};

type Props = { id: string; initial: EditState };

export function EditReminderForm({ id, initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<EditState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof EditState>(key: K, value: EditState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventDateIso = toUtcIso(state.eventDate, state.eventTime, state.timezone);
      const scheduleConfig =
        state.scheduleKind === "preset"
          ? { preset: state.preset }
          : { offsets: state.customOffsets };

      const result = await updateReminder(id, {
        title: state.title,
        reminder_type: state.reminderType,
        event_date: eventDateIso,
        message: state.message.trim() || null,
        schedule_type: state.scheduleKind,
        schedule_config: scheduleConfig,
        timezone: state.timezone,
      });

      if (result.ok) {
        router.push(`/reminders/${id}`);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div
        style={{ paddingTop: "var(--space-18)" }}
        className="px-6 pb-4 flex items-center justify-between"
      >
        <Link
          href={`/reminders/${id}`}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
        >
          <BackChevron />
        </Link>
        <h1 className="text-h2 text-ink">Edit reminder</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Input
            label="Title"
            variant="hero"
            value={state.title}
            onChange={(e) => set("title", e.target.value)}
            maxLength={80}
          />
          <div>
            <p className="text-caption text-ink-3 mb-3 pl-1">Type</p>
            <div className="flex gap-3">
              {REMINDER_TYPES.map((t) => (
                <TypeChip
                  key={t}
                  type={t}
                  selected={state.reminderType === t}
                  onSelect={(v) => set("reminderType", v)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-3 pl-1">Date & time</p>
          <DatePicker value={state.eventDate} onChange={(v) => set("eventDate", v)} />
          <TimePicker
            value={state.eventTime}
            onChange={(v) => set("eventTime", v)}
            label="Event time"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-3 pl-1">Notifications</p>
          <div className="flex flex-col gap-2">
            {SCHEDULE_PRESETS.map((p) => {
              const sel = state.scheduleKind === "preset" && state.preset === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, scheduleKind: "preset", preset: p }))}
                  aria-pressed={sel}
                  className={cn(
                    "w-full rounded-base bg-card border-[1.5px] px-4 py-3 text-left transition-colors",
                    sel ? "border-blue" : "border-hair",
                  )}
                >
                  <span className="text-body text-ink">{PRESET_LABELS[p]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-caption text-ink-3 mb-3 pl-1">Note (optional)</p>
          <textarea
            value={state.message}
            onChange={(e) => set("message", e.target.value.slice(0, 280))}
            placeholder="Anything to add..."
            rows={4}
            className={cn(
              "w-full rounded-base bg-card border-[1.5px] border-hair px-4 py-3.5",
              "text-body text-ink placeholder:text-ink-3 resize-none outline-none",
              "focus:border-blue transition-colors",
            )}
          />
        </div>

        {error ? <p className="text-caption text-orange">{error}</p> : null}
      </div>

      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          loading={loading}
          disabled={state.title.trim().length === 0}
          onClick={handleSave}
        >
          Save changes
        </Button>
      </div>
    </main>
  );
}

function BackChevron() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden>
      <title>Back</title>
      <path
        d="M7 1L1 7l6 6"
        stroke="var(--color-ink-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
