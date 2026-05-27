"use client";

import { Button } from "@/components/shared/Button";
import { FlowHeader } from "@/components/shared/FlowHeader";
import { Logo } from "@/components/shared/Logo";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MAX = 280;

const VARIABLE_CHIPS: Array<{ label: string; value: string }> = [
  { label: "+ Countdown", value: "[Countdown]" },
  { label: "+ Date", value: "[Date]" },
  { label: "+ Time", value: "[Time]" },
  { label: "+ Your name", value: "[Your name]" },
];

export default function CR4Page() {
  const router = useRouter();
  const message = useReminderDraft((s) => s.message);
  const title = useReminderDraft((s) => s.title);
  const scheduleKind = useReminderDraft((s) => s.scheduleKind);
  const setMessage = useReminderDraft((s) => s.setMessage);

  const back =
    scheduleKind === "custom" ? "/reminders/new/custom-times" : "/reminders/new/schedule";

  const appendVariable = (val: string) => {
    const next = (message + val).slice(0, MAX);
    setMessage(next);
  };

  const previewMessage = message.trim() || "Your notification message will appear here.";
  const previewTitle = title.trim() || "Untitled reminder";

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      <div style={{ paddingTop: "var(--space-18)" }}>
        <FlowHeader
          step={4}
          total={5}
          title="Customize the message"
          sub="This is what you'll see in your notifications."
          back={back}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-4">
        {/* iOS-style notification preview */}
        <div className="bg-card rounded-2xl border border-hair px-4 py-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            {/* App icon */}
            <div className="shrink-0 mt-0.5">
              <Logo size={36} />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-body font-bold text-ink">Daily</span>
                <span className="text-caption text-ink-3 shrink-0">Now</span>
              </div>
              <p className="text-body font-semibold text-ink leading-snug mb-0.5">{previewTitle}</p>
              <p className="text-body text-ink-2 leading-snug">{previewMessage}</p>
            </div>
          </div>
        </div>

        {/* Textarea */}
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

        {/* Variable insert chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6">
          {VARIABLE_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => appendVariable(chip.value)}
              className="shrink-0 bg-blue-soft text-blue text-caption font-medium px-3 h-7 rounded-full whitespace-nowrap"
            >
              {chip.label}
            </button>
          ))}
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
