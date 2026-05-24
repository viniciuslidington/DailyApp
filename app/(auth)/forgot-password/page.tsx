import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main
      className="absolute inset-0 flex flex-col bg-bg"
      style={{ padding: "var(--space-18) var(--space-10) var(--space-9)" }}
    >
      <h1 className="text-display text-ink mb-1.5">Reset password</h1>
      <p className="text-body text-ink-2">
        Password reset isn&apos;t available yet — it lands with auth polish in a follow-up.
      </p>
      <div className="flex-1" />
      <Link href="/login" className="text-action font-medium text-blue self-center">
        Back to sign in
      </Link>
    </main>
  );
}
