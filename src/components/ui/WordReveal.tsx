import { cn } from "@/lib/utils";

/**
 * ข้อความที่ค่อย ๆ ชัดขึ้นทีละวรรค (แนวเดียวกับ Text Animate / Blur Fade)
 *
 * สำคัญสำหรับภาษาไทย: ตัดตามช่องว่างเท่านั้น ห้ามตัดทีละตัวอักษร
 * เพราะสระและวรรณยุกต์จะหลุดออกจากพยัญชนะจนอ่านไม่ออก
 */
export function WordReveal({
  text,
  delay = 0,
  step = 110,
  className,
  as: Tag = "span",
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const chunks = text.split(" ").filter(Boolean);

  return (
    <Tag className={className}>
      {chunks.map((chunk, i) => (
        <span
          key={`${chunk}-${i}`}
          className={cn("rc-blur-in inline-block", i > 0 && "ml-[0.35em]")}
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {chunk}
        </span>
      ))}
    </Tag>
  );
}
