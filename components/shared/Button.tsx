"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "orange" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const baseClasses =
  "h-[54px] rounded-lg w-full flex items-center justify-center text-body-lg select-none transition-transform active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue text-white font-semibold tracking-[-0.2px]",
  orange: "bg-orange text-white font-semibold tracking-[-0.2px]",
  ghost: "text-ink-2 text-action font-medium bg-transparent",
};

const variantShadow: Record<Variant, string | undefined> = {
  primary: "var(--shadow-primary)",
  orange: "var(--shadow-orange)",
  ghost: undefined,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading, className, children, disabled, style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ boxShadow: variantShadow[variant], ...style }}
      {...rest}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
});

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
    />
  );
}
