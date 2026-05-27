"use client";

import { differenceInCalendarDays, format, parseISO } from "date-fns";

type DaysAwayBadgeProps = {
  /** YYYY-MM-DD */
  dateStr: string;
};

export function DaysAwayBadge({ dateStr }: DaysAwayBadgeProps) {
  const selected = parseISO(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = differenceInCalendarDays(selected, today);

  let label: string;
  if (diff === 0) label = "Today";
  else if (diff === 1) label = "Tomorrow";
  else if (diff === -1) label = "Yesterday";
  else if (diff > 1) label = `in ${diff} days`;
  else label = `${Math.abs(diff)} days ago`;

  const formattedDate = format(selected, "EEEE, MMMM d");

  return (
    <div
      style={{
        background: "#FDEEE3",
        borderRadius: 9999,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Orange dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#E06A00",
          flexShrink: 0,
        }}
      />

      {/* Date + countdown */}
      <span style={{ fontSize: 15, lineHeight: 1.3 }}>
        <span style={{ color: "#7A3300", fontWeight: 600 }}>{formattedDate}</span>
        <span style={{ color: "#B0744A", fontWeight: 400 }}> · {label}</span>
      </span>
    </div>
  );
}
