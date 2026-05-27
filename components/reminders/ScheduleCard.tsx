"use client";

import { cn } from "@/lib/utils";
import React from "react";

export type DotKind = "notification" | "mute" | "event" | "daily";

function TimelineDot({ kind }: { kind: DotKind }) {
  if (kind === "event") {
    return <div className="w-[13px] h-[13px] rounded-full bg-orange shrink-0 z-10" />;
  }
  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full shrink-0 z-10",
        kind === "notification" && "bg-blue",
        kind === "daily" && "bg-orange",
        kind === "mute" && "bg-track",
      )}
    />
  );
}

type TimelineProps = {
  dots: Array<{ kind: DotKind; label: string }>;
};

function Timeline({ dots }: TimelineProps) {
  const halfColPercent = 100 / dots.length / 2;

  return (
    <div className="relative flex items-center justify-between mt-3 mb-1">
      {/* connecting line centered at 6.5px from the top, starting/ending at first/last dot centers */}
      <div
        className="absolute top-[6.5px] -translate-y-1/2 h-[1.5px] bg-track"
        style={{
          left: `${halfColPercent}%`,
          right: `${halfColPercent}%`,
        }}
        aria-hidden
      />
      {dots.map((dot, i) => (
        <React.Fragment key={`${dot.label}-${i}`}>
          <div className="flex-1 flex flex-col items-center gap-1 z-10">
            <div className="h-[13px] flex items-center justify-center">
              <TimelineDot kind={dot.kind} />
            </div>
            <span className="text-[9px] leading-none text-ink-3 mt-0.5">{dot.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="w-5 h-5 rounded-full bg-blue flex items-center justify-center shrink-0">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
        <title>Selected</title>
        <path
          d="M1 4l3 3 5-6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export type ScheduleCardProps = {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  dots: Array<{ kind: DotKind; label: string }>;
};

export function ScheduleCard({ title, description, isSelected, onClick, dots }: ScheduleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        "w-full rounded-2xl bg-card border-[1.5px] px-4 pt-4 pb-3 text-left transition-colors",
        isSelected ? "border-blue" : "border-hair",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-body-lg font-semibold text-ink">{title}</span>
        {isSelected ? <CheckBadge /> : <div className="w-5 h-5" />}
      </div>
      <p className="text-body text-ink-2 mt-0.5 mb-1">{description}</p>
      <Timeline dots={dots} />
    </button>
  );
}
