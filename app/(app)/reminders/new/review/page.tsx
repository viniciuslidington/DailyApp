"use client";

import { format12h } from "@/components/reminders/TimePicker";
import { TYPE_VISUALS } from "@/components/reminders/TypeChip";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { createReminder } from "@/lib/reminders/actions";
import { PRESET_LABELS } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { formatEventDate, formatEventTime, toUtcIso } from "@/lib/time/reminder-time";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

export default function CR5Page() {
  const router = useRouter();
  const title = useReminderDraft((s) => s.title);
  const reminderType = useReminderDraft((s) => s.reminderType);
  const eventDate = useReminderDraft((s) => s.eventDate);
  const eventTime = useReminderDraft((s) => s.eventTime);
  const message = useReminderDraft((s) => s.message);
  const scheduleKind = useReminderDraft((s) => s.scheduleKind);
  const preset = useReminderDraft((s) => s.preset);
  const customOffsets = useReminderDraft((s) => s.customOffsets);
  const timezone = useReminderDraft((s) => s.timezone);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventDateIso = toUtcIso(eventDate, eventTime, timezone);
      const scheduleConfig = scheduleKind === "preset" ? { preset } : { offsets: customOffsets };

      const result = await createReminder({
        title,
        reminder_type: reminderType,
        event_date: eventDateIso,
        message: message.trim() || null,
        schedule_type: scheduleKind,
        schedule_config: scheduleConfig,
        timezone,
      });

      if (result.ok) {
        router.push(`/reminders/new/created?id=${result.data.id}`);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const typeVisual = TYPE_VISUALS[reminderType];
  const eventIso = toUtcIso(eventDate, eventTime, timezone);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={5}
          total={5}
          title="Looks good?"
          sub="Review your reminder before saving."
          back="/reminders/new/message"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        <ReviewRow
          label="Title & type"
          editHref="/reminders/new"
          value={
            <div className="flex items-center gap-2.5">
              <span
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-white text-meta font-bold ${typeVisual.tintClass}`}
                aria-hidden
              >
                {typeVisual.icon}
              </span>
              <span className="text-body-lg text-ink">{title}</span>
            </div>
          }
        />
        <ReviewRow
          label="Date & time"
          editHref="/reminders/new/when"
          value={
            <div>
              <p className="text-body-lg text-ink">{formatEventDate(eventIso, timezone)}</p>
              <p className="text-body text-ink-2">{formatEventTime(eventIso, timezone)}</p>
            </div>
          }
        />
        <ReviewRow
          label="Notifications"
          editHref="/reminders/new/schedule"
          value={
            scheduleKind === "preset" ? (
              <p className="text-body-lg text-ink">{PRESET_LABELS[preset]}</p>
            ) : (
              <div className="flex flex-col gap-1">
                {customOffsets.map((o) => (
                  <p key={o.days} className="text-body text-ink">
                    {o.days === 0 ? "On the day" : `${o.days} day${o.days > 1 ? "s" : ""} before`} ·{" "}
                    {format12h(o.time)}
                  </p>
                ))}
              </div>
            )
          }
        />
        {message.trim() ? (
          <ReviewRow
            label="Note"
            editHref="/reminders/new/message"
            value={<p className="text-body text-ink leading-snug">{message}</p>}
          />
        ) : null}

        {error ? <p className="text-caption text-orange text-center px-2">{error}</p> : null}
      </div>
      <div className="px-6 pb-3.5">
        <Button variant="primary" loading={loading} onClick={handleCreate}>
          Create reminder
        </Button>
      </div>
    </main>
  );
}

function ReviewRow({
  label,
  editHref,
  value,
}: {
  label: string;
  editHref: string;
  value: ReactNode;
}) {
  return (
    <div className="bg-card rounded-2xl border border-hair px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-caption text-ink-3 mb-1.5">{label}</p>
          {value}
        </div>
        <Link href={editHref} className="text-meta text-blue font-medium shrink-0 mt-0.5">
          Edit
        </Link>
      </div>
    </div>
  );
}
