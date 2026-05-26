"use client";

import { Button } from "@/components/shared/Button";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CreatedContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const reset = useReminderDraft((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg items-center justify-center px-6">
      <div className="flex flex-col items-center gap-5 mb-14">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
            <title>Success</title>
            <circle cx="18" cy="18" r="18" fill="var(--color-success)" fillOpacity="0.12" />
            <path
              d="M10 18l6 6 10-12"
              stroke="var(--color-success)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-title text-ink mb-2">Reminder created!</h1>
          <p className="text-body text-ink-2">We'll notify you at the right time.</p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        {id ? (
          <Link href={`/reminders/${id}`}>
            <Button variant="primary" className="w-full">
              View reminder
            </Button>
          </Link>
        ) : null}
        <Link href="/today">
          <Button variant="ghost" className="w-full">
            Back to Today
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default function CR6Page() {
  return (
    <Suspense>
      <CreatedContent />
    </Suspense>
  );
}
