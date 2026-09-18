import { cn } from "@/lib/utils";

/**
 * โลโก้ Recharger Energy
 *
 * ไฟล์ต้นฉบับ (public/brand/recharger-logo.webp) เป็นตัวอักษรกลวงสีขาว
 * จึงมองไม่เห็นบนพื้นสว่าง — ในหน้าเว็บจึงประกอบโลโก้ขึ้นใหม่จากสองส่วน:
 *   1. สัญลักษณ์วงกลม+สายฟ้า วาดเป็น SVG ตามต้นฉบับ (ไล่สีมิ้นต์→ฟ้า)
 *   2. ตัวอักษรเซ็ตด้วย LINE Seed Sans TH ให้เปลี่ยนสีตามโหมดสว่าง/มืดได้
 * ทำให้โลโก้คมทุกขนาดและอ่านออกทั้งสองโหมด
 */

function bolt(cx: number, cy: number) {
  return [
    `M${cx + 2.5},${cy - 11.5}`,
    `L${cx - 6.5},${cy + 1}`,
    `L${cx - 1},${cy + 1}`,
    `L${cx - 3.5},${cy + 11.5}`,
    `L${cx + 6.5},${cy - 2}`,
    `L${cx + 1},${cy - 2}`,
    "Z",
  ].join(" ");
}

export function LogoMark({
  size = 38,
  id = "rc-logo",
  className,
}: {
  size?: number;
  id?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="42" x2="44" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--rc-mint-400)" />
          <stop offset="100%" stopColor="var(--rc-cyan-500)" />
        </linearGradient>
      </defs>
      {/* วงแหวนเปิด — สื่อถึงการหมุนเวียนพลังงาน */}
      <path
        d="M26.95 7.26 A17 17 0 1 1 7.26 21.05"
        stroke={`url(#${id}-g)`}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* หัวลูกศรปลายวงแหวน */}
      <path d="M7.4 21.6 L1.8 20.3 L8.4 8.6 L14.2 19.2 Z" fill={`url(#${id}-g)`} />
      {/* สายฟ้าคู่ */}
      <path d={bolt(19.5, 24)} fill={`url(#${id}-g)`} opacity="0.95" />
      <path d={bolt(27.5, 24)} fill={`url(#${id}-g)`} />
    </svg>
  );
}

export function Logo({
  size = 38,
  compact,
  onDark,
  className,
  id,
}: {
  size?: number;
  compact?: boolean;
  onDark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} id={id} />
      {!compact && (
        <span className="flex flex-col leading-[0.95]">
          <span
            className={cn(
              "text-[0.8rem] font-extrabold tracking-[0.155em]",
              onDark ? "text-white/90" : "text-fg",
            )}
          >
            RECHARGER
          </span>
          <span className="text-[1.02rem] font-black tracking-[0.03em] text-brand">
            ENERGY
          </span>
        </span>
      )}
    </span>
  );
}
