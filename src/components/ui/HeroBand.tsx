import type { ReactNode } from "react";
import { GridPattern } from "./GridPattern";
import { InteractiveGrid } from "./InteractiveGrid";
import { cn } from "@/lib/utils";

/**
 * แถบหัวหน้าที่ใช้ร่วมกันทั้งเว็บ
 *
 * เดิมเป็นแถบพื้นมืดตายตัว ทำให้เว็บที่ตั้งใจให้สว่างเป็นหลักมีแถบมืดคั่นเป็นช่วง ๆ
 * ตอนนี้เปลี่ยนมาใช้ token ของธีม จึงสว่างตามหน้าในโหมดสว่าง และมืดตามหน้าในโหมดมืด
 * เอกลักษณ์ของแถบมาจากลายตารางและแสงเรืองแทน ไม่ใช่จากการสลับสีพื้น
 */
export function HeroBand({
  children,
  className,
  glow = "both",
  grid = true,
  interactive = true,
  underHeader = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: "both" | "left" | "right" | "none";
  grid?: boolean;
  /** ตารางจุดที่ตอบสนองเมาส์ — ปิดได้ถ้าแถบนั้นเตี้ยจนไม่คุ้มจะวาด */
  interactive?: boolean;
  /**
   * ดันพื้นหลังขึ้นไปอยู่ใต้แถบเมนูด้วย margin ติดลบ แล้วดันเนื้อหาลงมาด้วย padding เท่ากัน
   * ผลคือพื้นหลัง ลายตาราง และแสงเรือง เต็มตั้งแต่ขอบบนสุดของจอ
   * โดยที่เนื้อหายังไม่ไปมุดอยู่ใต้เมนู
   */
  underHeader?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative flex flex-col overflow-hidden bg-bg",
        underHeader && "-mt-16 pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]",
        className,
      )}
    >
      {/* ไล่สีจาง ๆ ให้พื้นไม่แบน โดยไม่ต้องเปลี่ยนเป็นสีเข้มทั้งแถบ */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--rc-cyan-500) 10%, transparent), transparent 70%)",
        }}
      />

      {grid && (
        <>
          <GridPattern
            size={64}
            className="text-fg/[0.055] dark:text-white/[0.07]"
            fade="radial"
          />
          {/* ตารางจุดที่ขยับตามเมาส์ วางทับลายเส้นอีกชั้น
              ถ้าเครื่องไม่มีเมาส์ หรือผู้ใช้ตั้งค่าลดการเคลื่อนไหว คอมโพเนนต์นี้จะไม่วาดอะไรเลย
              เหลือแต่ลายเส้นนิ่ง ๆ ตามเดิม */}
          {interactive && <InteractiveGrid />}
        </>
      )}

      {(glow === "both" || glow === "left") && (
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full opacity-[0.13] blur-[110px] dark:opacity-[0.18]"
          style={{ background: "var(--rc-mint-400)" }}
        />
      )}
      {(glow === "both" || glow === "right") && (
        <div
          className="pointer-events-none absolute -right-28 bottom-[-12rem] h-[32rem] w-[32rem] rounded-full opacity-[0.12] blur-[110px] dark:opacity-[0.16]"
          style={{ background: "var(--rc-cyan-500)" }}
        />
      )}

      <div className="relative flex flex-1 flex-col">{children}</div>
    </section>
  );
}
