"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; icon: (active: boolean) => React.ReactNode };

const TABS: Tab[] = [
  {
    href: "/today",
    label: "Today",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <title>Today</title>
        {active ? (
          <>
            <rect x="3" y="4" width="18" height="17" rx="4" fill="var(--color-blue)" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="1.5" />
            <circle cx="8" cy="13" r="1.3" fill="white" />
            <circle cx="12" cy="13" r="1.3" fill="white" />
            <circle cx="16" cy="13" r="1.3" fill="white" />
            <circle cx="8" cy="17.5" r="1.3" fill="white" />
            <circle cx="12" cy="17.5" r="1.3" fill="white" />
          </>
        ) : (
          <>
            <rect
              x="3"
              y="4"
              width="18"
              height="17"
              rx="4"
              stroke="var(--color-ink-3)"
              strokeWidth="1.7"
            />
            <line x1="3" y1="9" x2="21" y2="9" stroke="var(--color-ink-3)" strokeWidth="1.3" />
            <circle cx="8" cy="13" r="1.3" fill="var(--color-ink-3)" />
            <circle cx="12" cy="13" r="1.3" fill="var(--color-ink-3)" />
            <circle cx="16" cy="13" r="1.3" fill="var(--color-ink-3)" />
            <circle cx="8" cy="17.5" r="1.3" fill="var(--color-ink-3)" />
            <circle cx="12" cy="17.5" r="1.3" fill="var(--color-ink-3)" />
          </>
        )}
      </svg>
    ),
  },
  {
    href: "/all",
    label: "All",
    icon: (active) => {
      const c = active ? "var(--color-blue)" : "var(--color-ink-3)";
      const sw = active ? "2.2" : "1.7";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <title>All</title>
          <circle cx="5" cy="7" r="1.8" fill={c} />
          <circle cx="5" cy="12" r="1.8" fill={c} />
          <circle cx="5" cy="17" r="1.8" fill={c} />
          <line x1="10" y1="7" x2="20" y2="7" stroke={c} strokeWidth={sw} strokeLinecap="round" />
          <line x1="10" y1="12" x2="20" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
          <line x1="10" y1="17" x2="18" y2="17" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    },
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <title>Stats</title>
        {active ? (
          <>
            <rect x="3" y="14" width="4.5" height="7" rx="1.5" fill="var(--color-blue)" />
            <rect x="9.75" y="9" width="4.5" height="12" rx="1.5" fill="var(--color-blue)" />
            <rect x="16.5" y="4" width="4.5" height="17" rx="1.5" fill="var(--color-blue)" />
          </>
        ) : (
          <>
            <rect
              x="3"
              y="14"
              width="4.5"
              height="7"
              rx="1.5"
              stroke="var(--color-ink-3)"
              strokeWidth="1.5"
            />
            <rect
              x="9.75"
              y="9"
              width="4.5"
              height="12"
              rx="1.5"
              stroke="var(--color-ink-3)"
              strokeWidth="1.5"
            />
            <rect
              x="16.5"
              y="4"
              width="4.5"
              height="17"
              rx="1.5"
              stroke="var(--color-ink-3)"
              strokeWidth="1.5"
            />
          </>
        )}
      </svg>
    ),
  },
  {
    href: "/you",
    label: "You",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <title>You</title>
        {active ? (
          <>
            <circle cx="12" cy="7" r="4" fill="var(--color-blue)" />
            <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="var(--color-blue)" />
          </>
        ) : (
          <>
            <circle cx="12" cy="7" r="4" stroke="var(--color-ink-3)" strokeWidth="1.7" />
            <path
              d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
              stroke="var(--color-ink-3)"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    ),
  },
];

const TAB_PATHS = new Set(TABS.map((t) => t.href));

export function BottomNav() {
  const path = usePathname();
  if (!TAB_PATHS.has(path)) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 px-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="h-16 rounded-3xl bg-card border border-hair flex items-center"
        style={{ boxShadow: "var(--shadow-floating)" }}
      >
        {TABS.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
              aria-current={active ? "page" : undefined}
            >
              {icon(active)}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  active ? "text-blue" : "text-ink-3",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
