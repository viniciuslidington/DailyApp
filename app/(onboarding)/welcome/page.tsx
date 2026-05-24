"use client";

import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main
      className="absolute inset-0 flex flex-col bg-card"
      style={{ padding: "var(--space-30) var(--space-11) var(--space-9)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Logo size={96} />
        <div className="text-center">
          <div className="text-brand text-ink">Daily</div>
          <p className="mt-2.5 text-body-lg text-ink-2 leading-snug max-w-[280px] mx-auto">
            One small thing,
            <br />
            every day.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Link href="/signup" prefetch>
          <Button variant="primary">Get started</Button>
        </Link>
        <Link href="/login" prefetch>
          <Button variant="ghost">I already have an account</Button>
        </Link>
      </div>
    </main>
  );
}
