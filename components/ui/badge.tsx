import * as React from "react";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium";
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    outline: "border-border bg-transparent text-foreground/80",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

