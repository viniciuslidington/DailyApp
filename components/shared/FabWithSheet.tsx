"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TAB_PATHS = new Set(["/today", "/all", "/stats", "/you"]);

export function FabWithSheet() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  if (!TAB_PATHS.has(path)) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(15, 18, 25, 0.45)" }}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sheet card — floats above the FAB */}
      <div
        className="fixed z-50"
        style={{
          bottom: "calc(172px + env(safe-area-inset-bottom))",
          left: 16,
          right: 16,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
          opacity: open ? 1 : 0,
          transition: "transform 240ms cubic-bezier(0.32, 0.72, 0, 1), opacity 180ms ease",
          transformOrigin: "bottom center",
        }}
        aria-hidden={!open}
      >
        <div
          className="bg-card rounded-3xl border border-hair overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
        >
          {/* Pill handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-mute" />
          </div>

          {/* Reminder option */}
          <Link
            href="/reminders/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-5 py-4 border-b border-hair"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--color-blue)" }}
            >
              <BellIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-lg font-semibold text-ink">New reminder</p>
              <p className="text-caption text-ink-3">One-time event or appointment</p>
            </div>
            <SmallChevron />
          </Link>

          {/* Routine option */}
          <Link
            href="/routines/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-5 py-4"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--color-success)" }}
            >
              <RepeatIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-lg font-semibold text-ink">New routine</p>
              <p className="text-caption text-ink-3">Daily habit or recurring activity</p>
            </div>
            <SmallChevron />
          </Link>
        </div>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close" : "Create new"}
        aria-expanded={open}
        className="fixed right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          bottom: "calc(100px + env(safe-area-inset-bottom))",
          background: "var(--color-blue)",
          boxShadow: "0 4px 16px rgba(47, 107, 255, 0.4)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          <title>{open ? "Close" : "Create"}</title>
          <path d="M10 4v12M4 10h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <title>Reminder</title>
      <path
        d="M10 2.5a5.5 5.5 0 0 0-5.5 5.5v2.5L3 13h14l-1.5-2.5V8A5.5 5.5 0 0 0 10 2.5z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 15.5a1.5 1.5 0 0 0 3 0"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <title>Routine</title>
      <path
        d="M3 7h11a3 3 0 0 1 0 6H3"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 4L3 7l3 3"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmallChevron() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden>
      <title>Open</title>
      <path
        d="M1 1l4 4-4 4"
        stroke="var(--color-ink-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
