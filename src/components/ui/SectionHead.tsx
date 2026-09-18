import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "left",
  onDark,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-9 flex flex-col gap-4 sm:mb-12",
        align === "center" && "items-center text-center",
        action && "sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "t-overline mb-3",
              onDark ? "text-[var(--rc-mint-300)]" : "text-brand",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2 className={cn("t-h2", onDark && "text-white")}>{title}</h2>
        {sub && (
          <p
            className={cn(
              "t-body mt-3",
              onDark ? "text-white/70" : "text-fg-muted",
            )}
          >
            {sub}
          </p>
        )}
      </Reveal>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
