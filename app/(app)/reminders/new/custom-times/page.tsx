"use client";

import { TimePicker } from "@/components/reminders/TimePicker";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import type { CustomOffset } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { useRouter } from "next/navigation";

function dayLabel(days: number): string {
  if (days === 0) return "On the day";
  if (days === 1) return "1 day before";
  return `${days} days before`;
}

export default function CR3cPage() {
  const router = useRouter();
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const setScheduleCustom = useReminderDraft((s) => s.setScheduleCustom);

  const updateTime = (days: number, time: string) => {
    const next: CustomOffset[] = customOffsets.map((o) => (o.days === days ? { ...o, time } : o));
    setScheduleCustom(next);
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={3}
          total={5}
          title="Set a time for each day"
          sub="When should the notification arrive?"
          back="/reminders/new/custom-days"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {customOffsets.map((offset) => (
          <TimePicker
            key={offset.days}
            label={dayLabel(offset.days)}
            value={offset.time}
            onChange={(t) => updateTime(offset.days, t)}
          />
        ))}
      </div>
      <div className="px-6 pb-3.5">
        <Button variant="primary" onClick={() => router.push("/reminders/new/message")}>
          Continue
        </Button>
      </div>
    </main>
  );
}
