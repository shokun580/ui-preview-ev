import { cn } from "@/lib/utils";

/** ดาวคะแนน — ดาวเต็มใช้ถมสี ดาวที่เหลือใช้เส้น เพื่อให้อ่านค่าได้ไวในสายตาเดียว */
export function Stars({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} จาก 5 ดาว`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= Math.round(value) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinejoin="round"
          className="text-[var(--rc-amber)]"
          aria-hidden="true"
        >
          <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9L12 3.5z" />
        </svg>
      ))}
    </span>
  );
}
