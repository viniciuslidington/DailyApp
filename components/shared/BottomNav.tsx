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
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <title>Today</title>
        <path
          d="M11 2L3 9v11h5v-6h6v6h5V9L11 2z"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "var(--color-blue-soft)" : "none"}
        />
      </svg>
    ),
  },
  {
    href: "/all",
    label: "All",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <title>All</title>
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="2"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          fill="none"
        />
        <rect
          x="12"
          y="3"
          width="7"
          height="7"
          rx="2"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          fill="none"
        />
        <rect
          x="3"
          y="12"
          width="7"
          height="7"
          rx="2"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          fill="none"
        />
        <rect
          x="12"
          y="12"
          width="7"
          height="7"
          rx="2"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          fill="none"
        />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <title>Stats</title>
        <rect
          x="3"
          y="11"
          width="4"
          height="8"
          rx="1.5"
          fill={active ? "var(--color-blue)" : "var(--color-ink-3)"}
        />
        <rect
          x="9"
          y="7"
          width="4"
          height="12"
          rx="1.5"
          fill={active ? "var(--color-blue)" : "var(--color-ink-3)"}
        />
        <rect
          x="15"
          y="3"
          width="4"
          height="16"
          rx="1.5"
          fill={active ? "var(--color-blue)" : "var(--color-ink-3)"}
        />
      </svg>
    ),
  },
  {
    href: "/you",
    label: "You",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <title>You</title>
        <circle
          cx="11"
          cy="7"
          r="3.5"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          fill={active ? "var(--color-blue-soft)" : "none"}
        />
        <path
          d="M3.5 19c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5"
          stroke={active ? "var(--color-blue)" : "var(--color-ink-3)"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
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
      className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-sm border-t border-hair z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center h-14">
        {TABS.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
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
