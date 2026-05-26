import type { RoutineType } from "@/lib/routines/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoutineDraft = {
  routineType: RoutineType;
  title: string;
  daysOfWeek: number[];
  timesOfDay: string[];
  goalPerWeek: number | null;
  timezone: string;

  setRoutineType: (type: RoutineType, label: string) => void;
  setTitle: (title: string) => void;
  setDaysOfWeek: (days: number[]) => void;
  setTimesOfDay: (times: string[]) => void;
  setGoalPerWeek: (goal: number | null) => void;
  reset: () => void;
};

function defaults(): Omit<
  RoutineDraft,
  "setRoutineType" | "setTitle" | "setDaysOfWeek" | "setTimesOfDay" | "setGoalPerWeek" | "reset"
> {
  return {
    routineType: "drink_water",
    title: "Drink water",
    daysOfWeek: [1, 2, 3, 4, 5],
    timesOfDay: ["09:00"],
    goalPerWeek: null,
    timezone:
      typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  };
}

export const useRoutineDraft = create<RoutineDraft>()(
  persist(
    (set) => ({
      ...defaults(),
      setRoutineType: (routineType, title) => set({ routineType, title }),
      setTitle: (title) => set({ title }),
      setDaysOfWeek: (daysOfWeek) => set({ daysOfWeek }),
      setTimesOfDay: (timesOfDay) => set({ timesOfDay }),
      setGoalPerWeek: (goalPerWeek) => set({ goalPerWeek }),
      reset: () => set(defaults()),
    }),
    { name: "daily.routine-draft" },
  ),
);
