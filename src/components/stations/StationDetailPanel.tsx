"use client";

import { useEffect } from "react";
import type { Station } from "@/data/stations";
import { StationDetailBody } from "./StationDetail";
import { Icon } from "@/components/ui/Icon";

/**
 * แผงรายละเอียดสถานี — จัดวางแบบเดียวกับ Google Maps คือ
 *
 *   จอใหญ่ (lg ขึ้นไป)  เปิดเป็น "แผงที่สอง" ต่อจากรายการผลลัพธ์ทางซ้าย
 *                       รายการยังอยู่ให้เห็น กดสลับดูสถานีอื่นได้โดยไม่ต้องปิดแผงก่อน
 *   จอกลาง (md)         ที่ไม่พอวางสองแผง จึงทับรายการไปเลยในกรอบเดิม
 *   มือถือ              ทับแผ่นเลื่อนด้านล่างแล้วคลี่ขึ้นเต็ม
 *
 * ทุกกรณีไม่มีฉากมืดคลุม แผนที่จึงยังใช้งานได้เต็มที่
 */
export function StationDetailPanel({
  station,
  distance,
  onClose,
}: {
  station: Station | null;
  distance?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!station) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [station, onClose]);

  if (!station) return null;

  return (
    <aside
      className={[
        "rc-panel-enter absolute z-[45] hidden flex-col overflow-hidden border border-border bg-bg md:flex",
        "md:inset-y-0 md:left-0 md:w-[20rem] md:border-y-0 md:border-l-0 md:shadow-none",
        "lg:inset-y-6 lg:left-[27.75rem] lg:w-[26rem] lg:rounded-panel lg:border lg:shadow-pop",
      ].join(" ")}
      aria-label={`รายละเอียด ${station.name}`}
    >
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 py-2">
        {/* จอ md แผงนี้ทับรายการอยู่ จึงต้องมีทางกลับ ส่วน lg รายการอยู่ข้าง ๆ แล้ว */}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.8125rem] font-bold text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg lg:hidden"
        >
          <Icon name="chevronLeft" size={17} />
          กลับไปรายการ
        </button>
        <span className="hidden px-3 py-2 text-[0.8125rem] text-fg-muted lg:block">
          รายละเอียดสถานี
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          className="ml-auto grid h-9 w-9 place-items-center rounded-full text-fg-faint transition-colors hover:bg-surface-hover hover:text-fg"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <StationDetailBody station={station} distance={distance} variant="panel" />
      </div>
    </aside>
  );
}
