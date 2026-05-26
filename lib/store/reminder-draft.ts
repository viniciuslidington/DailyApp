import type { CustomOffset, ReminderType, SchedulePreset } from "@/lib/reminders/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cross-screen state for the 8-step create-reminder flow. Persisted to
 * localStorage so the user can navigate back/forward, refresh, or come back
 * tomorrow without losing input. Cleared by the Created screen on success and
 * by the Cancel chip in FlowHeader.
 */
export type ReminderDraft = {
  title: string;
  reminderType: ReminderType;
  // Wall-clock the user picked, in their own timezone. Serialized to a UTC
  // ISO at submit time.
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM (24h)
  message: string;
  scheduleKind: "preset" | "custom";
  preset: SchedulePreset;
  customOffsets: CustomOffset[];
  timezone: string;

  setTitle: (title: string) => void;
  setReminderType: (type: ReminderType) => void;
  setEventDate: (date: string) => void;
  setEventTime: (time: string) => void;
  setMessage: (message: string) => void;
  setSchedulePreset: (preset: SchedulePreset) => void;
  setScheduleCustom: (offsets: CustomOffset[]) => void;
  reset: () => void;
};

function todayPlus(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

function defaults() {
  return {
    title: "",
    reminderType: "meeting" as ReminderType,
    eventDate: todayPlus(1),
    eventTime: "14:00",
    message: "",
    scheduleKind: "preset" as "preset" | "custom",
    preset: "on_day" as SchedulePreset,
    customOffsets: [{ days: 0, time: "09:00" }] as CustomOffset[],
    timezone:
      typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  };
}

export const useReminderDraft = create<ReminderDraft>()(
  persist(
    (set) => ({
      ...defaults(),
      setTitle: (title) => set({ title }),
      setReminderType: (reminderType) => set({ reminderType }),
      setEventDate: (eventDate) => set({ eventDate }),
      setEventTime: (eventTime) => set({ eventTime }),
      setMessage: (message) => set({ message }),
      setSchedulePreset: (preset) => set({ scheduleKind: "preset", preset }),
      setScheduleCustom: (customOffsets) => set({ scheduleKind: "custom", customOffsets }),
      reset: () => set(defaults()),
    }),
    { name: "daily.reminder-draft" },
  ),
);
