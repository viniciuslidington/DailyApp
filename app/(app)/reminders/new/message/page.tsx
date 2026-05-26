"use client";

import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MAX = 280;

export default function CR4Page() {
  const router = useRouter();
  const message = useReminderDraft((s) => s.message);
  const scheduleKind = useReminderDraft((s) => s.scheduleKind);
  const setMessage = useReminderDraft((s) => s.setMessage);

  const back =
    scheduleKind === "custom" ? "/reminders/new/custom-times" : "/reminders/new/schedule";

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={4}
          total={5}
          title="Add a personal note"
          sub="Optional — appears in your notification."
          back={back}
        />
      </div>
      <div className="flex-1 px-6 pb-6">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
            placeholder="e.g. Remember to bring the documents"
            rows={5}
            className={cn(
              "w-full rounded-base bg-card border-[1.5px] border-hair px-4 py-3.5",
              "text-body text-ink placeholder:text-ink-3 resize-none outline-none",
              "focus:border-blue transition-colors",
            )}
          />
          <span className="absolute bottom-3 right-4 text-caption text-ink-3 tabular-nums">
            {message.length}/{MAX}
          </span>
        </div>
      </div>
      <div className="px-6 pb-3.5 flex flex-col gap-2">
        <Button variant="primary" onClick={() => router.push("/reminders/new/review")}>
          Continue
        </Button>
        {message.trim().length === 0 && (
          <Button variant="ghost" onClick={() => router.push("/reminders/new/review")}>
            Skip
          </Button>
        )}
      </div>
    </main>
  );
}
