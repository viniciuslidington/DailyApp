"use client";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Logo } from "@/components/shared/Logo";
import { signIn } from "@/lib/auth/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function AppleIcon() {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="currentColor" aria-hidden>
      <title>Apple</title>
      <path d="M13.769 10.417c-.022-2.263 1.848-3.357 1.933-3.41-1.054-1.542-2.692-1.752-3.274-1.772-1.393-.141-2.72.822-3.427.822-.705 0-1.79-.8-2.944-.779-1.508.022-2.902.882-3.677 2.232C.558 10.26 1.69 14.48 3.483 16.79c.9 1.23 1.965 2.6 3.36 2.55 1.354-.054 1.864-.867 3.498-.867 1.635 0 2.1.867 3.52.839 1.453-.024 2.374-1.24 3.258-2.477.647-.912 1.005-1.903 1.013-1.953-.022-.01-3.34-1.276-3.363-5.465zM11.326 3.41C12.07 2.5 12.568 1.234 12.43 0c-1.149.046-2.56.774-3.393 1.715-.744.834-1.39 2.142-1.215 3.397C9.006 5.199 10.56 4.34 11.326 3.41z" />
    </svg>
  );
}

// Google brand colors — must remain exact per Google's identity guidelines
const G_BLUE = "#4285F4"; // no-hex-ok
const G_GREEN = "#34A853"; // no-hex-ok
const G_YELLOW = "#FBBC05"; // no-hex-ok
const G_RED = "#EA4335"; // no-hex-ok

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <title>Google</title>
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill={G_BLUE}
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill={G_GREEN}
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill={G_YELLOW}
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
        fill={G_RED}
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const signInWithProvider = (provider: "apple" | "google") => {
    const supabase = createSupabaseBrowserClient();
    void supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/today` },
    });
  };

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

        {/* "or" divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-hair" />
          <span className="text-micro font-medium text-ink-3 uppercase tracking-[0.4px]">or</span>
          <div className="flex-1 h-px bg-hair" />
        </div>

        {/* Social login */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => signInWithProvider("apple")}
            className="h-[52px] rounded-base bg-ink text-white flex items-center justify-center gap-2.5 text-body font-semibold"
          >
            <AppleIcon />
            Continue with Apple
          </button>
          <button
            type="button"
            onClick={() => signInWithProvider("google")}
            className="h-[52px] rounded-base bg-card text-ink border border-hair flex items-center justify-center gap-2.5 text-body font-semibold"
          >
            <GoogleIcon />
            Continue with Google
          </button>
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
