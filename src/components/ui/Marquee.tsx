import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * แถบเลื่อนต่อเนื่อง — ทำรายการซ้ำสองชุดแล้วเลื่อนไป 50% ภาพจึงต่อกันไม่มีรอยสะดุด
 * ขอบซ้าย-ขวาจางหายด้วย mask เพื่อไม่ให้เห็นรอยตัด
 */
export function Marquee({
  children,
  duration = 38,
  className,
  fade = true,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  fade?: boolean;
}) {
  const mask =
    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)";

  return (
    <div
      className={cn("rc-marquee relative w-full overflow-hidden", className)}
      style={fade ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      <div
        className="rc-marquee-track"
        style={{ ["--rc-marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
