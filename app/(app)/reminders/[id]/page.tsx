import { format12h } from "@/components/reminders/TimePicker";
import { deleteReminderAction } from "@/lib/reminders/actions";
import {
  PRESET_LABELS,
  type ReminderType,
  TYPE_LABELS,
  readSchedule,
} from "@/lib/reminders/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { describeDaysUntil, formatEventDate, formatEventTime } from "@/lib/time/reminder-time";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ReminderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: reminder } = await supabase.from("reminders").select("*").eq("id", id).single();

  if (!reminder) notFound();

  const schedule = readSchedule(reminder);
  const daysUntil = describeDaysUntil(reminder.event_date, reminder.timezone);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div
        style={{ paddingTop: "var(--space-18)" }}
        className="px-6 pb-4 flex items-center justify-between"
      >
        <Link
          href="/today"
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
        >
          <BackChevron />
        </Link>
        <h1 className="text-h2 text-ink">Reminder</h1>
        <Link href={`/reminders/${id}/edit`} className="text-meta text-blue font-medium">
          Edit
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        <div className="bg-card rounded-2xl border border-hair px-4 py-4">
          <p className="text-caption text-ink-3 mb-1">Title</p>
          <p className="text-h2 text-ink leading-snug">{reminder.title}</p>
          <p className="text-body text-ink-2 mt-0.5">
            {TYPE_LABELS[reminder.reminder_type as ReminderType]}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-hair px-4 py-4">
          <p className="text-caption text-ink-3 mb-1">When</p>
          <p className="text-body-lg text-ink font-medium">
            {formatEventDate(reminder.event_date, reminder.timezone)}
          </p>
          <p className="text-body text-ink-2">
            {formatEventTime(reminder.event_date, reminder.timezone)}
          </p>
          <p className="text-caption text-blue mt-1.5">{daysUntil}</p>
        </div>

        <div className="bg-card rounded-2xl border border-hair px-4 py-4">
          <p className="text-caption text-ink-3 mb-1.5">Notifications</p>
          {schedule.type === "preset" ? (
            <p className="text-body-lg text-ink">{PRESET_LABELS[schedule.config.preset]}</p>
          ) : (
            <div className="flex flex-col gap-1">
              {schedule.config.offsets.map((o) => (
                <p key={o.days} className="text-body text-ink">
                  {o.days === 0 ? "On the day" : `${o.days} day${o.days > 1 ? "s" : ""} before`} ·{" "}
                  {format12h(o.time)}
                </p>
              ))}
            </div>
          )}
        </div>

        {reminder.message ? (
          <div className="bg-card rounded-2xl border border-hair px-4 py-4">
            <p className="text-caption text-ink-3 mb-1">Note</p>
            <p className="text-body text-ink leading-snug">{reminder.message}</p>
          </div>
        ) : null}
      </div>

      <div className="px-6 pb-3.5">
        <form action={deleteReminderAction}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="h-[54px] rounded-lg w-full flex items-center justify-center text-body-lg text-orange font-medium"
          >
            Delete reminder
          </button>
        </form>
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
