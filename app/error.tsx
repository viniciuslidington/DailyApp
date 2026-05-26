"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-dvh bg-bg px-8 text-center">
      <h1 className="text-h2 text-ink font-semibold mb-2">Something went wrong</h1>
      <p className="text-body text-ink-3 mb-8">An unexpected error occurred. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="h-[54px] px-8 bg-blue text-white rounded-2xl text-body-lg font-semibold"
        style={{ boxShadow: "var(--shadow-primary)" }}
      >
        Try again
      </button>
    </main>
  );
}
