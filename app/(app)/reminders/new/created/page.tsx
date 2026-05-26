"use client";

import { Button } from "@/components/shared/Button";
import { useReminderDraft } from "@/lib/store/reminder-draft";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CreatedContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const reset = useReminderDraft((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <main className="absolute inset-0 flex flex-col bg-bg">
      {/* Success banner */}
      <div
        className="bg-card border-b border-hair px-6 py-4"
        style={{ paddingTop: "calc(var(--space-18) + var(--space-4))" }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-body-lg font-bold text-ink">Reminder created</span>
          <button
            type="button"
            onClick={() => router.push("/today")}
            className="text-caption text-blue font-medium"
          >
            Undo
          </button>
        </div>
        <p className="text-body text-ink-2">First ping soon.</p>
      </div>

      {/* Centered success state */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
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
            <h1 className="text-title text-ink mb-2">You're all set!</h1>
            <p className="text-body text-ink-2">We'll notify you at the right time.</p>
          </div>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="px-6 pb-3.5 flex flex-col gap-2 w-full">
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
