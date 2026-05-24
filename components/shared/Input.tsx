"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from "react";

type InputVariant = "default" | "hero";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  trailing?: ReactNode;
  variant?: InputVariant;
  error?: string;
};

const wrapperBase = "rounded-base bg-card border-[1.5px] flex items-center transition-colors";
const wrapperByVariant: Record<InputVariant, string> = {
  default: "h-[52px] px-4 text-body-lg",
  hero: "h-16 px-5 text-h2 rounded-lg",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, trailing, variant = "default", error, className, onFocus, onBlur, id, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const errorId = error ? `${id ?? rest.name}-error` : undefined;
  return (
    <label className="block" htmlFor={id}>
      {label ? <span className="block text-caption text-ink-2 mb-1.5 pl-1">{label}</span> : null}
      <span
        className={cn(
          wrapperBase,
          wrapperByVariant[variant],
          focused || variant === "hero" ? "border-blue" : "border-hair",
          error ? "border-orange" : "",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3"
          {...rest}
        />
        {trailing ? <span className="ml-3 text-ink-3 flex items-center">{trailing}</span> : null}
      </span>
      {error ? (
        <span id={errorId} className="block text-caption text-orange mt-1.5 pl-1">
          {error}
        </span>
      ) : null}
    </label>
  );
});
