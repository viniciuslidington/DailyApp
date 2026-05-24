type NotificationPreviewProps = {
  name?: string;
};

/**
 * iOS-style frosted notification mock for the permission primer (S5).
 * Pure decoration — no interactivity.
 */
export function NotificationPreview({ name }: NotificationPreviewProps) {
  return (
    <div className="relative h-[220px] mt-2">
      {/* Secondary card, behind */}
      <div
        className="absolute top-[60px] left-1.5 right-1.5 bg-glass-soft rounded-[22px] p-3.5 opacity-60"
        style={{
          backdropFilter: "blur(20px)",
          transform: "scale(0.92)",
          boxShadow: "0 6px 24px var(--shadow-amt), 0 0 0 1px var(--color-glass-border)",
        }}
      >
        <div className="h-3 w-20 bg-mute rounded-md mb-2" />
        <div className="h-2.5 w-[70%] bg-track rounded-sm" />
      </div>

      {/* Primary card, foreground */}
      <div
        className="absolute top-[30px] left-0 right-0 bg-glass rounded-[22px] px-4 py-3.5 flex gap-3 items-start"
        style={{
          backdropFilter: "blur(20px)",
          boxShadow: "0 14px 40px var(--shadow-amt-2), 0 0 0 1px var(--color-glass-border)",
        }}
      >
        <div
          className="w-[38px] h-[38px] rounded-md bg-card flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: "inset 0 0 0 1px var(--color-hair)" }}
        >
          <div className="w-[18px] h-[18px] rounded-full border-[3px] border-blue" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <div className="text-meta font-semibold text-ink">Daily</div>
            <div className="text-caption text-ink-3">now</div>
          </div>
          <div className="text-meta text-ink leading-snug">
            Good morning{name ? `, ${name}` : ""} 👋 — drink a glass of water before coffee.
          </div>
        </div>
      </div>
    </div>
  );
}
