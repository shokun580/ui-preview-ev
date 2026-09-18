import { cn } from "@/lib/utils";

/**
 * ลายตารางและลายจุดสำหรับพื้นหลัง — แนวเดียวกับ Grid/Dot Pattern ของ Magic UI
 * แต่เขียนเองเพื่อคุมความจางและใช้ token สีของแบรนด์
 *
 * ใช้ mask ไล่จากกลางออกขอบ ลายจึงจางหายไปเองแทนที่จะตัดเป็นเส้นตรง
 */
export function GridPattern({
  size = 56,
  variant = "grid",
  className,
  fade = "radial",
}: {
  size?: number;
  variant?: "grid" | "dot";
  className?: string;
  fade?: "radial" | "top" | "none";
}) {
  const id = `rc-${variant}-${size}`;
  const mask =
    fade === "radial"
      ? "radial-gradient(ellipse 72% 62% at 50% 40%, #000 30%, transparent 100%)"
      : fade === "top"
        ? "linear-gradient(to bottom, #000 0%, transparent 92%)"
        : undefined;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          {variant === "grid" ? (
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ) : (
            <circle cx={1.4} cy={1.4} r={1.4} fill="currentColor" />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
