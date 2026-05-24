"use client";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Logo } from "@/components/shared/Logo";
import { signIn } from "@/lib/auth/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result.ok) {
        router.push("/today");
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <main
      className="absolute inset-0 flex flex-col bg-bg"
      style={{ paddingTop: "var(--space-16)" }}
    >
      {/* Back chevron */}
      <div className="px-6 mb-7">
        <Link
          href="/welcome"
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-card border border-hair flex items-center justify-center"
        >
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden>
            <title>Back</title>
            <path
              d="M7 1L1 7l6 6"
              stroke="var(--color-ink-2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Logo + greeting */}
      <div className="px-6 mb-7 flex flex-col items-start gap-4">
        <Logo size={56} />
        <div>
          <h1 className="text-display text-ink">Welcome back</h1>
          <p className="text-body text-ink-2 mt-1.5">Sign in to pick up where you left off.</p>
        </div>
      </div>

      <form action={onSubmit} className="px-6 flex-1 flex flex-col">
        <div className="space-y-3.5">
          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            inputMode="email"
            required
          />
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            autoComplete="current-password"
            required
            trailing={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="text-ink-3"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                  <title>{showPassword ? "Hide" : "Show"}</title>
                  <path
                    d="M1 7s3-6 9-6 9 6 9 6-3 6-9 6S1 7 1 7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="10" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            }
          />
        </div>

        <div className="text-right mt-1 pr-1">
          <Link href="/forgot-password" className="text-caption font-semibold text-blue">
            Forgot password?
          </Link>
        </div>

        {error ? (
          <p className="text-caption text-orange mt-3 pl-1" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5">
          <Button type="submit" variant="primary" loading={pending}>
            Sign in
          </Button>
        </div>

        <div className="flex-1" />

        <p className="text-center text-meta text-ink-2 pb-7">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
