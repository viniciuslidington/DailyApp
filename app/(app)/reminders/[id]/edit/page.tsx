import { readSchedule } from "@/lib/reminders/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fromUtcIso } from "@/lib/time/reminder-time";
import { notFound } from "next/navigation";
import { EditReminderForm } from "./EditReminderForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditReminderPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: reminder } = await supabase.from("reminders").select("*").eq("id", id).single();

  if (!reminder) notFound();

  const { date, time } = fromUtcIso(reminder.event_date, reminder.timezone);
  const schedule = readSchedule(reminder);

  return (
    <EditReminderForm
      id={id}
      initial={{
        title: reminder.title,
        reminderType: reminder.reminder_type,
        eventDate: date,
        eventTime: time,
        message: reminder.message ?? "",
        scheduleKind: reminder.schedule_type as "preset" | "custom",
        preset: schedule.type === "preset" ? schedule.config.preset : "on_day",
        customOffsets:
          schedule.type === "custom" ? schedule.config.offsets : [{ days: 0, time: "09:00" }],
        timezone: reminder.timezone,
      }}
    />
  );
}
