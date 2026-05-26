import { z } from "zod";

export const REMINDER_TYPES = ["meeting", "event", "deadline", "task"] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

export const SCHEDULE_PRESETS = ["on_day", "day_before", "three_days", "week_before"] as const;
export type SchedulePreset = (typeof SCHEDULE_PRESETS)[number];

// "HH:MM" 24-hour. Storage uses 24h regardless of display locale.
const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM.");

export const customOffsetSchema = z.object({
  days: z.number().int().min(0).max(60),
  time: timeOfDay,
});
export type CustomOffset = z.infer<typeof customOffsetSchema>;

export const presetScheduleSchema = z.object({
  preset: z.enum(SCHEDULE_PRESETS),
});

export const customScheduleSchema = z.object({
  offsets: z.array(customOffsetSchema).min(1, "Pick at least one notification."),
});

export const scheduleConfigSchema = z.discriminatedUnion("kind", [
  presetScheduleSchema.extend({ kind: z.literal("preset") }),
  customScheduleSchema.extend({ kind: z.literal("custom") }),
]);

// Storage shape (matches reminders.schedule_type + schedule_config columns).
export type StoredSchedule =
  | { type: "preset"; config: z.infer<typeof presetScheduleSchema> }
  | { type: "custom"; config: z.infer<typeof customScheduleSchema> };

export const reminderInputSchema = z.object({
  title: z.string().trim().min(1, "Give it a name.").max(80),
  reminder_type: z.enum(REMINDER_TYPES),
  // ISO timestamp (with offset) — the client converts the user's chosen
  // wall-clock to UTC before sending so the server stays timezone-blind.
  event_date: z.string().datetime({ offset: true }),
  message: z.string().trim().max(280).nullable().optional(),
  schedule_type: z.enum(["preset", "custom"]),
  schedule_config: z.union([presetScheduleSchema, customScheduleSchema]),
  timezone: z.string().min(1),
});

export type ReminderInput = z.infer<typeof reminderInputSchema>;

// Row shape coming back from Supabase (what the UI reads).
export type ReminderRow = {
  id: string;
  user_id: string;
  title: string;
  reminder_type: ReminderType;
  event_date: string;
  message: string | null;
  schedule_type: "preset" | "custom";
  schedule_config: z.infer<typeof presetScheduleSchema> | z.infer<typeof customScheduleSchema>;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export function readSchedule(
  row: Pick<ReminderRow, "schedule_type" | "schedule_config">,
): StoredSchedule {
  if (row.schedule_type === "preset") {
    return { type: "preset", config: presetScheduleSchema.parse(row.schedule_config) };
  }
  return { type: "custom", config: customScheduleSchema.parse(row.schedule_config) };
}

// Human label for the preset (used in lists and review screens).
export const PRESET_LABELS: Record<SchedulePreset, string> = {
  on_day: "On the day",
  day_before: "1 day before",
  three_days: "3 days before",
  week_before: "1 week before",
};

export const TYPE_LABELS: Record<ReminderType, string> = {
  meeting: "Meeting",
  event: "Event",
  deadline: "Deadline",
  task: "Task",
};
