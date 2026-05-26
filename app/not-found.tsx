import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh bg-bg px-8 text-center">
      <p className="text-display text-ink-3 font-bold mb-1">404</p>
      <h1 className="text-h2 text-ink font-semibold mb-2">Page not found</h1>
      <p className="text-body text-ink-3 mb-8">This page doesn&apos;t exist or has moved.</p>
      <Link
        href="/today"
        className="h-[54px] px-8 bg-blue text-white rounded-2xl text-body-lg font-semibold flex items-center"
        style={{ boxShadow: "var(--shadow-primary)" }}
      >
        Go to Today
      </Link>
    </main>
  );
}
