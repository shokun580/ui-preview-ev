"use client";

import { toggleTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * ปุ่มสลับโหมดสว่าง/มืด
 *
 * ไอคอนดวงจันทร์กับดวงอาทิตย์สลับกันด้วย CSS ตามคลาส .dark บน <html>
 * จึงไม่ต้องรอ JavaScript และไม่มีจังหวะที่ไอคอนกระพริบตอนโหลดหน้า
 *
 * หมายเหตุ: เคยมีปุ่มสลับภาษา TH/EN คู่กันตรงนี้ ตอนนี้เอาออกแล้วเพราะเว็บเป็นภาษาไทยอย่างเดียว
 * ระบบแปล (src/lib/i18n.tsx) ยังอยู่ครบ ถ้าจะเปิดภาษาอังกฤษภายหลังก็ทำปุ่มใหม่ได้ไม่ยาก
 */
export function ThemeToggle({ onDark }: { onDark?: boolean }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("theme.switch")}
      title={t("theme.switch")}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border transition-colors",
        onDark
          ? "border-white/20 text-white hover:bg-white/10"
          : "border-border text-fg-muted hover:border-brand hover:text-brand",
      )}
    >
      <Icon name="moon" size={18} className="dark:hidden" />
      <Icon name="sun" size={18} className="hidden dark:block" />
    </button>
  );
}
