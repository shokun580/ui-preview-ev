import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * คะแนนสถานี — มาจากทีมสำรวจของ Recharger ที่ไปดูหน้างานเอง ไม่ใช่ค่าเฉลี่ยรีวิวจากผู้ใช้
 *
 * จึงตั้งใจไม่ใช้ไอคอนดาวและไม่บอกจำนวนรีวิว เพราะสองอย่างนั้นเป็นภาษาภาพของ
 * "คะแนนมวลชน" แบบ Google Maps ถ้าใช้ คนจะเข้าใจว่าเป็นคะแนนจากผู้ใช้หลายคน
 * ใช้ไอคอนคลิปบอร์ดสำรวจแทน และเขียนแหล่งที่มากำกับทุกที่ที่มีพื้นที่พอ
 */
const SOURCE_NOTE =
  "ทีมสำรวจของเราเป็นคนไปดูหน้างานและให้คะแนนเอง ไม่ได้เฉลี่ยจากรีวิวของผู้ใช้";

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
        title={`คะแนนจากทีมสำรวจ Recharger ${value} เต็ม 5 — ${SOURCE_NOTE}`}
        className={cn(
          /* ทำเป็นชิปมีพื้นหลังเหมือน badge ตัวอื่นในแถวเดียวกัน
             ถ้าปล่อยเป็นตัวเลขลอย ๆ มันจะไปอ่านต่อกับราคาที่อยู่ข้าง ๆ เป็น "4.8 ฿7.50" */
          "inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-1 text-[0.75rem] text-accent-soft-fg",
          className,
        )}
      >
        <Icon name="survey" size={13} className="shrink-0" />
        <span className="font-bold">{value}</span>
      </span>
    );
  }

  return (
    <div className={cn("rounded-card border border-border bg-bg-subtle p-4", className)}>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
          <Icon name="survey" size={19} />
        </span>
        <div className="min-w-0">
          <p className="text-[0.875rem] text-fg-muted">คะแนนจากทีมสำรวจ Recharger</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="t-h3 text-brand">{value}</span>
            <span className="t-caption">จาก 5</span>
          </p>
        </div>
      </div>
      <p className="t-caption mt-3">{SOURCE_NOTE}</p>
    </div>
  );
}
