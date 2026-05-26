import { z } from "zod";

export const ROUTINE_TYPES = [
  "drink_water",
  "stretch",
  "read",
  "walk",
  "meditate",
  "custom",
] as const;
export type RoutineType = (typeof ROUTINE_TYPES)[number];

export const ROUTINE_LABELS: Record<RoutineType, string> = {
  drink_water: "Drink water",
  stretch: "Stretch",
  read: "Read",
  walk: "Walk",
  meditate: "Meditate",
  custom: "Custom",
};

export const ROUTINE_ICONS: Record<RoutineType, string> = {
  drink_water: "💧",
  stretch: "🧘",
  read: "📖",
  walk: "🚶",
  meditate: "✦",
  custom: "+",
};

export const ROUTINE_TINTS: Record<RoutineType, string> = {
  drink_water: "bg-tint-blue",
  stretch: "bg-purple-soft",
  read: "bg-tint-amber",
  walk: "bg-tint-green",
  meditate: "bg-tint-pink",
  custom: "bg-tint-gray",
};

export const ROUTINE_ICON_COLORS: Record<RoutineType, string> = {
  drink_water: "text-blue",
  stretch: "text-purple",
  read: "text-orange",
  walk: "text-success",
  meditate: "text-purple",
  custom: "text-ink-2",
};

// Accept HH:MM or HH:MM:SS (Postgres TIME[] returns seconds) and normalize to HH:MM
const timeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Time must be HH:MM.")
  .transform((t) => t.slice(0, 5));

export const routineInputSchema = z.object({
  title: z.string().trim().min(1, "Give it a name.").max(80),
  routine_type: z.enum(ROUTINE_TYPES),
  days_of_week: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one day."),
  times_of_day: z.array(timeOfDay).min(1, "Pick at least one time."),
  goal_per_week: z.number().int().min(1).max(7).nullable().optional(),
  goal_unit: z.string().nullable().optional(),
  timezone: z.string().min(1),
});

export type RoutineInput = z.infer<typeof routineInputSchema>;

export type RoutineRow = {
  id: string;
  user_id: string;
  title: string;
  routine_type: RoutineType;
  days_of_week: number[];
  times_of_day: string[];
  goal_per_week: number | null;
  goal_unit: string | null;
  active: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type RoutineLogRow = {
  id: string;
  routine_id: string;
  user_id: string;
  log_date: string;
  completed: boolean;
  completed_at: string | null;
};

// Short human label for days_of_week array, e.g. [1,2,3,4,5] → "Mon – Fri"
export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function formatDaysOfWeek(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return "Every day";
  if (sorted.length === 5 && sorted.every((d, i) => d === [1, 2, 3, 4, 5][i])) return "Weekdays";
  if (sorted.length === 2 && sorted[0] === 0 && sorted[1] === 6) return "Weekends";
  return sorted.map((d) => WEEKDAY_SHORT[d]).join(", ");
}
