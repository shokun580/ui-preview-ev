import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "accent" | "ok" | "warn" | "danger" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-sunken text-fg-muted",
  brand: "bg-brand-soft text-brand-soft-fg",
  accent: "bg-accent-soft text-accent-soft-fg",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  outline: "border border-border text-fg-muted",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.75rem] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
