import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * โลโก้ของแอปชาร์จแต่ละเจ้า
 *
 * ไฟล์อยู่ใน /public/brand/apps/ ดึงมาจากไอคอนแอปทางการ
 * (ดู scripts/fetch-app-logos.mjs)
 *
 * ใช้มุมโค้งประมาณ 22% ของด้าน ซึ่งเป็นสัดส่วนเดียวกับไอคอนแอปบนมือถือ
 * ทำให้วางเรียงกันแล้วดูเป็นชุดเดียวกับที่ผู้ใช้เห็นในเครื่องตัวเอง
 */
export function AppLogo({
  id,
  name,
  size = 44,
  className,
}: {
  id: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden border border-black/[0.06] bg-white dark:border-white/10",
        className,
      )}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.22) }}
    >
      <Image
        src={`/brand/apps/${id}.png`}
        alt={`โลโก้ ${name}`}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
