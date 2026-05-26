import { signOut } from "@/lib/auth/actions";
import Link from "next/link";

export default function TodayPage() {
  return (
    <main className="min-h-dvh bg-bg flex flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-title text-ink">Today</h1>
      <p className="text-body text-ink-2 text-center max-w-sm">
        Home screen — Phase 5. Use the links below to test Phase 3.
      </p>
      <div className="flex flex-col items-center gap-3 mt-2">
        <Link href="/reminders/new" className="text-action text-blue font-medium">
          + New reminder
        </Link>
        <Link href="/routines/new" className="text-action text-blue font-medium">
          + New routine
        </Link>
      </div>
      <form action={signOut}>
        <button type="submit" className="text-action text-ink-2 font-medium">
          Sign out
        </button>
      </form>
    </main>
  );
}
