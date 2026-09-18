import type { IconName } from "@/components/ui/Icon";
import type { TranslationKey } from "@/lib/i18n";

export type NavItem = {
  href: string;
  key: TranslationKey;
  shortKey?: TranslationKey;
  icon: IconName;
  children?: Array<{ href: string; key: TranslationKey; desc: string; icon: IconName }>;
};

/** เมนูหลักบนจอใหญ่ — "บทความ" ยุบเป็นเมนูย่อยใต้ "วิธีใช้งาน" ตามที่ตกลงไว้ (ข้อ 15.2) */
export const mainNav: NavItem[] = [
  { href: "/", key: "nav.home", icon: "home" },
  { href: "/stations", key: "nav.stations", shortKey: "nav.stationsShort", icon: "mapPin" },
  {
    href: "/guide",
    key: "nav.guide",
    icon: "book",
    children: [
      {
        href: "/guide",
        key: "nav.guideLong",
        desc: "5 ขั้นตอนชาร์จครั้งแรก และแบบทดสอบหาแอปที่เหมาะกับคุณ",
        icon: "bolt",
      },
      {
        href: "/blog",
        key: "nav.blog",
        desc: "บทความเจาะลึกเรื่องหัวชาร์จ ค่าไฟ และคำถามที่พบบ่อย",
        icon: "book",
      },
    ],
  },
  { href: "/install", key: "nav.install", shortKey: "nav.installShort", icon: "wrench" },
  { href: "/contact", key: "nav.contact", icon: "chat" },
];

/**
 * แถบเมนูล่างจอมือถือ — เรียงตามที่ลูกค้ากำหนด และย้าย "ค้นหา" มาไว้ตรงกลาง
 * เพราะเป็นงานที่เร่งด่วนที่สุดเวลาใช้บนมือถือ (แบตใกล้หมดระหว่างขับ) และนิ้วโป้งกดถนัดที่สุด
 */
export const bottomNav: Array<NavItem & { emphasise?: boolean }> = [
  { href: "/", key: "nav.home", icon: "home" },
  { href: "/install", key: "nav.installShort", icon: "wrench" },
  { href: "/stations", key: "nav.stationsShort", icon: "search" },
  { href: "/guide", key: "nav.guide", icon: "book" },
  { href: "/contact", key: "nav.contact", icon: "chat" },
];
