import { cn } from "@/lib/utils";

type ProgressDotsProps = {
  index: number;
  total?: number;
  className?: string;
};

export function ProgressDots({ index, total = 4, className }: ProgressDotsProps) {
  return (
    <div
      role="progressbar"
      tabIndex={-1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const active = i === index;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-[3px] transition-[width] duration-[var(--motion-dot)]",
              active ? "w-[22px] bg-blue" : "w-1.5 bg-mute",
            )}
          />
        );
      })}
    </div>
  );
}
