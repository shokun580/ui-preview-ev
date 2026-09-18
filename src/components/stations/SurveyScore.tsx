import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * คะแนนสถานี — ที่มาคือทีมสำรวจของ Recharger ไปดูหน้างานเอง ไม่ใช่ค่าเฉลี่ยรีวิวจากผู้ใช้
 * แต่แสดงผลเป็นดาวสีเหลืองตามแบบที่คนคุ้นเคย เพราะอ่านปราดเดียวก็รู้ว่าคือคะแนน
 * ข้อความอธิบายที่มาแบบยาวถูกตัดออกตามที่ตกลงกันไว้ เหลือกำกับไว้แค่ชื่อ
 * "คะแนนจากทีมสำรวจ Recharger" ในหน้ารายละเอียด
 */
export function SurveyScore({
  score,
  variant = "compact",
  className,
}: {
  score: number;
  variant?: "compact" | "full";
  className?: string;
}) {
  const value = score.toFixed(1);

  if (variant === "compact") {
    return (
      <span
        title={`คะแนนจากทีมสำรวจ Recharger ${value} เต็ม 5`}
        className={cn(
          /* ทำเป็นชิปมีพื้นหลังเหมือน badge ตัวอื่นในแถวเดียวกัน
             ถ้าปล่อยเป็นตัวเลขลอย ๆ มันจะไปอ่านต่อกับราคาที่อยู่ข้าง ๆ เป็น "4.8 ฿7.50" */
          /* ตัวเลขใช้สีข้อความปกติ ไม่ใช่สีเหลืองตามดาว เพราะเหลืองบนพื้นครีม
             ในธีมสว่างมีคอนทราสต์ราว 2:1 อ่านไม่ออก ให้ดาวเป็นตัวถือสีไว้พอ */
          "inline-flex items-center gap-1 rounded-full bg-warn-soft px-2 py-1 text-[0.75rem] text-fg",
          className,
        )}
      >
        <Icon name="star" size={13} filled className="shrink-0 text-warn" />
        <span className="font-bold">{value}</span>
      </span>
    );
  }

  return (
    <p className={cn("flex items-center gap-2", className)}>
      <Icon name="star" size={20} filled className="shrink-0 text-warn" />
      <span className="t-h3 text-fg">{value}</span>
      <span className="t-body-sm text-fg-muted">คะแนนจากทีมสำรวจ Recharger</span>
    </p>
  );
}
