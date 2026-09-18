"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNav } from "./nav";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * แถบเมนูล่างจอสำหรับมือถือ (ซ่อนตั้งแต่จอ md ขึ้นไป)
 *
 * เป็นการ์ดลอยขอบมน เว้นขอบทั้งสองข้างและด้านล่าง ไอคอนอยู่บนชื่อเมนู
 * ช่องที่เลือกอยู่เน้นด้วยวงกลมสีอ่อนหลังไอคอนและตัวหนังสือเข้มขึ้น
 *
 * สองเรื่องที่ต้องระวังกับแถบแบบลอย:
 *
 *  1. **พื้นที่รอบการ์ดต้องโปร่งและกดทะลุได้** กล่องนอกจึงตั้ง pointer-events เป็น none
 *     แล้วเปิดเฉพาะตัวการ์ด ไม่งั้นแถบใสที่มองไม่เห็นจะไปบังไม่ให้กดของที่อยู่ข้างหลัง
 *
 *  2. **ที่ว่างที่หน้าอื่นต้องเผื่อ ต้องรวมระยะขอบล่างด้วย** ไม่ใช่แค่ความสูงการ์ด
 *     จึงเก็บค่ารวมไว้ที่ตัวแปร --rc-dock-h ที่เดียว แล้วให้ทุกที่อ้างอิงตัวนั้น
 */
export function BottomTab() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav
        className="pointer-events-auto mx-3 mb-3 grid h-[4.25rem] grid-cols-5 rounded-[1.75rem] border border-border bg-bg/92 px-1.5 shadow-pop backdrop-blur-2xl"
        aria-label="เมนูหลัก"
      >
        {bottomNav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="group flex flex-col items-center justify-center gap-0.5 rounded-3xl transition-transform active:scale-[0.94]"
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full transition-colors duration-200",
                  active ? "bg-brand-soft text-brand" : "text-fg-faint",
                )}
              >
                <Icon name={item.icon} size={20} />
              </span>
              <span
                className={cn(
                  // ไม่ใช้ leading-none เพราะสระบนกับวรรณยุกต์ไทยจะถูกตัดหัว
                  "text-[0.6875rem] leading-[1.4] transition-colors duration-200",
                  active ? "font-bold text-fg" : "text-fg-faint",
                )}
              >
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
