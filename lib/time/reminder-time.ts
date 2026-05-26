import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

/** Combine YYYY-MM-DD + HH:MM in `timezone` and return the UTC ISO instant. */
export function toUtcIso(date: string, time: string, timezone: string): string {
  return fromZonedTime(`${date}T${time}:00`, timezone).toISOString();
}

/** Inverse: split a UTC instant back into the user's wall-clock pair. */
export function fromUtcIso(iso: string, timezone: string): { date: string; time: string } {
  const zoned = toZonedTime(new Date(iso), timezone);
  return {
    date: format(zoned, "yyyy-MM-dd"),
    time: format(zoned, "HH:mm"),
  };
}

/** "Friday, May 29" — long weekday + month + day in the reminder's timezone. */
export function formatEventDate(iso: string, timezone: string): string {
  return formatInTimeZone(new Date(iso), timezone, "EEEE, MMMM d");
}

/** "2:00 PM" — 12-hour clock in the reminder's timezone. */
export function formatEventTime(iso: string, timezone: string): string {
  return formatInTimeZone(new Date(iso), timezone, "h:mm a");
}

/** Day-of-month string ("29") in the reminder's timezone. */
export function formatDayOfMonth(iso: string, timezone: string): string {
  return formatInTimeZone(new Date(iso), timezone, "d");
}

/** "in 6 days" / "Tomorrow" / "Today" / "5 days ago" relative to now. */
export function describeDaysUntil(iso: string, timezone: string): string {
  const eventDayKey = formatInTimeZone(new Date(iso), timezone, "yyyy-MM-dd");
  const todayKey = formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
  const event = new Date(`${eventDayKey}T00:00:00Z`).getTime();
  const today = new Date(`${todayKey}T00:00:00Z`).getTime();
  const diff = Math.round((event - today) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}
