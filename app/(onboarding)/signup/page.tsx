"use client";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { ProgressDots } from "@/components/shared/ProgressDots";
import { signUp } from "@/lib/auth/actions";
import { useOnboardingDraft } from "@/lib/store/onboarding";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const setEmail = useOnboardingDraft((s) => s.setEmail);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result.ok) {
        setEmail(String(formData.get("email") ?? ""));
        router.push("/name");
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <main
      className="absolute inset-0 flex flex-col bg-bg"
      style={{ padding: "var(--space-18) var(--space-10) 0" }}
    >
      <div className="mb-6">
        <ProgressDots index={0} />
      </div>
      <h1 className="text-display text-ink mb-1.5">Create your account</h1>
      <p className="text-body text-ink-2 mb-7">So your reminders follow you everywhere.</p>

      <form action={onSubmit} className="flex-1 flex flex-col">
        <div className="space-y-3.5">
          <Input
            id="signup-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@example.com"
          />
          <Input
            id="signup-password"
            name="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
          />
        </div>
        {error ? (
          <p className="text-caption text-orange mt-3 pl-1" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex-1" />
        <div className="pb-3.5">
          <Button type="submit" variant="primary" loading={pending}>
            Continue
          </Button>
        </div>
      </form>
    </main>
  );
}
