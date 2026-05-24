import { signOut } from "@/lib/auth/actions";

export default function TodayPage() {
  return (
    <main className="min-h-dvh bg-bg flex flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-title text-ink">Today</h1>
      <p className="text-body text-ink-2 text-center max-w-sm">
        Onboarding done — this screen ships in Phase 5 (Home / Stats / You).
      </p>
      <form action={signOut}>
        <button type="submit" className="text-action text-blue font-medium">
          Sign out
        </button>
      </form>
    </main>
  );
}
