"use client";

import { TypeChip } from "@/components/reminders/TypeChip";
import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { Input } from "@/components/shared/Input";
import { REMINDER_TYPES } from "@/lib/reminders/schema";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { useRouter } from "next/navigation";

export default function CR1Page() {
  const router = useRouter();
  const title = useReminderDraft((s) => s.title);
  const reminderType = useReminderDraft((s) => s.reminderType);
  const setTitle = useReminderDraft((s) => s.setTitle);
  const setReminderType = useReminderDraft((s) => s.setReminderType);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={1}
          total={5}
          title="What are you reminding yourself about?"
          sub="Give it a name and pick a type."
          back="/today"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-6">
        <Input
          variant="hero"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Doctor appointment"
          maxLength={80}
          autoFocus
        />
        <div>
          <p className="text-caption text-ink-3 mb-3 pl-1">Type</p>
          <div className="flex gap-3">
            {REMINDER_TYPES.map((t) => (
              <TypeChip key={t} type={t} selected={reminderType === t} onSelect={setReminderType} />
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 pb-3.5">
        <Button
          variant="primary"
          disabled={title.trim().length === 0}
          onClick={() => router.push("/reminders/new/when")}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
