"use client";

import { DatePicker } from "@/components/reminders/DatePicker";
import { DaysAwayBadge } from "@/components/reminders/DaysAwayBadge";
import { TimePicker } from "@/components/reminders/TimePicker";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { useRouter } from "next/navigation";

export default function CR2Page() {
  const router = useRouter();
  const eventDate = useReminderDraft((s) => s.eventDate);
  const eventTime = useReminderDraft((s) => s.eventTime);
  const setEventDate = useReminderDraft((s) => s.setEventDate);
  const setEventTime = useReminderDraft((s) => s.setEventTime);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={2}
          total={5}
          title="When is it happening?"
          sub="Pick a date and time for the event."
          back="/reminders/new"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-4">
        <DatePicker value={eventDate} onChange={setEventDate} />
        <TimePicker value={eventTime} onChange={setEventTime} label="Event time" />
        <DaysAwayBadge dateStr={eventDate} />
      </div>
      <div className="px-6 pb-3.5">
        <Button variant="primary" onClick={() => router.push("/reminders/new/schedule")}>
          Continue
        </Button>
      </div>
    </main>
  );
}
