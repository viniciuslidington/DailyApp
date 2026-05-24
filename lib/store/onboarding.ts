import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingDraft = {
  email: string | null;
  displayName: string | null;
  reminderHour: number; // 0-23 in user's local time
  reminderMinute: number; // 0-59
  timezone: string;
  setEmail: (email: string) => void;
  setDisplayName: (name: string) => void;
  setReminderTime: (hour: number, minute: number) => void;
  reset: () => void;
};

const defaultState = {
  email: null,
  displayName: null,
  reminderHour: 8,
  reminderMinute: 30,
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
};

/**
 * Cross-screen onboarding draft. Persisted to localStorage so a page reload
 * mid-flow doesn't lose the user's name or chosen reminder time.
 */
export const useOnboardingDraft = create<OnboardingDraft>()(
  persist(
    (set) => ({
      ...defaultState,
      setEmail: (email) => set({ email }),
      setDisplayName: (displayName) => set({ displayName }),
      setReminderTime: (reminderHour, reminderMinute) => set({ reminderHour, reminderMinute }),
      reset: () => set(defaultState),
    }),
    { name: "daily.onboarding" },
  ),
);
