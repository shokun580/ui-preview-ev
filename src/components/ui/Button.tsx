import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "onColor" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "t-button inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[var(--shadow-brand)] hover:bg-brand-hover hover:-translate-y-0.5 active:translate-y-0 dark:text-[var(--rc-ink-950)]",
  secondary:
    "border border-border-strong bg-surface text-fg hover:border-brand hover:text-brand hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-fg-muted hover:bg-surface-hover hover:text-fg",
  onDark:
    "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0",
  /* ปุ่มขาวทึบ สำหรับวางบนพื้นไล่สีหรือพื้นเข้ม — ห้าม override สีด้วย className
     เพราะคลาสสีข้อความจะชนกันเองจนตัวอักษรหายไป */
  onColor:
    "bg-white text-[var(--rc-ink-900)] hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.875rem]",
  md: "h-11 px-5",
  lg: "h-13 px-7 text-[1rem]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  className,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  className,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </Link>
  );
}
