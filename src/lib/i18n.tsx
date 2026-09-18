"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Locale = "th" | "en";
const STORAGE_KEY = "rc-locale";

/**
 * ขอบเขตการแปลของ MVP นี้ (ตามที่ตกลงในข้อ 19.6):
 * แปล navigation / hero / ปุ่ม / ชื่อ section
 * ส่วนเนื้อหายาว เช่น บทความ รายละเอียดสถานี รายละเอียดบริการ ยังคงเป็นภาษาไทย
 */
const dict = {
  th: {
    "nav.home": "หน้าแรก",
    "nav.stations": "ค้นหาสถานีชาร์จ",
    "nav.stationsShort": "ค้นหา",
    "nav.guide": "วิธีใช้งาน",
    "nav.guideLong": "รู้จักวิธีใช้งาน",
    "nav.blog": "บทความ",
    "nav.install": "ติดตั้งสถานี",
    "nav.installShort": "ติดตั้ง",
    "nav.contact": "ติดต่อ",
    "nav.menu": "เมนู",
    "nav.close": "ปิด",

    "cta.quote": "ขอใบเสนอราคา",
    "cta.quoteLong": "ขอใบเสนอราคาติดตั้ง",
    "cta.findStation": "ค้นหาสถานีชาร์จ",
    "cta.learnMore": "ดูรายละเอียด",
    "cta.viewAll": "ดูทั้งหมด",
    "cta.consult": "ปรึกษาฟรี",
    "cta.contactUs": "ติดต่อเรา",
    "cta.startHere": "เริ่มต้นที่นี่",
    "cta.readMore": "อ่านต่อ",
    "cta.backHome": "กลับหน้าแรก",

    "hero.eyebrow": "แพลตฟอร์มชาร์จ EV ครบวงจร",
    "hero.title": "ชาร์จที่ไหนก็ได้ ติดตั้งที่บ้านคุณก็ได้",
    "hero.sub":
      "รวมสถานีชาร์จทั่วไทยไว้ในที่เดียว พร้อมทีมออกแบบและติดตั้งเครื่องชาร์จสำหรับบ้านและธุรกิจ ตั้งแต่สำรวจหน้างานจนถึงดูแลหลังติดตั้ง",
    "hero.searchPlaceholder": "ค้นหาชื่อสถานี ห้าง หรือจังหวัด",

    "section.stats": "ตัวเลขของ Recharger",
    "section.map": "สถานีชาร์จทั่วประเทศไทย",
    "section.guide": "ชาร์จครั้งแรก? เริ่มที่นี่",
    "section.apps": "แอปชาร์จที่ควรรู้จัก",
    "section.services": "บริการติดตั้งของเรา",
    "section.process": "ขั้นตอนการทำงาน",
    "section.portfolio": "ตัวอย่างหน้างานที่ติดตั้งแล้ว",
    "section.about": "เกี่ยวกับ Recharger",
    "section.blog": "บทความน่ารู้เรื่อง EV",

    "theme.switch": "สลับโหมดสว่าง / โหมดมืด",
    "lang.switch": "เปลี่ยนภาษา",
    "lang.note": "หน้านี้แปลบางส่วนเป็นตัวอย่าง เนื้อหาเชิงลึกยังเป็นภาษาไทย",
  },
  en: {
    "nav.home": "Home",
    "nav.stations": "Find a station",
    "nav.stationsShort": "Search",
    "nav.guide": "How to use",
    "nav.guideLong": "How EV charging works",
    "nav.blog": "Articles",
    "nav.install": "Installation",
    "nav.installShort": "Install",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close",

    "cta.quote": "Get a quote",
    "cta.quoteLong": "Request an installation quote",
    "cta.findStation": "Find a charging station",
    "cta.learnMore": "View details",
    "cta.viewAll": "View all",
    "cta.consult": "Free consultation",
    "cta.contactUs": "Contact us",
    "cta.startHere": "Start here",
    "cta.readMore": "Read more",
    "cta.backHome": "Back to home",

    "hero.eyebrow": "End-to-end EV charging platform",
    "hero.title": "Charge anywhere. Install at your place.",
    "hero.sub":
      "Every charging station in Thailand in one place — plus a team that designs and installs chargers for homes and businesses, from site survey to aftercare.",
    "hero.searchPlaceholder": "Search a station, mall or province",

    "section.stats": "Recharger in numbers",
    "section.map": "Charging stations across Thailand",
    "section.guide": "First time charging? Start here",
    "section.apps": "Charging apps worth knowing",
    "section.services": "Our installation services",
    "section.process": "How we work",
    "section.portfolio": "Completed installations",
    "section.about": "About Recharger",
    "section.blog": "EV articles",

    "theme.switch": "Switch between light and dark mode",
    "lang.switch": "Change language",
    "lang.note": "Partial translation — long-form content remains in Thai.",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["th"];

/* ────────────────────────────────────────────────
   เก็บภาษาไว้นอก React แล้วให้คอมโพเนนต์สมัครรับการเปลี่ยนแปลง
   วิธีนี้ทำให้ไม่ต้องอ่าน localStorage ใน effect ตอน mount
   ซึ่งจะทำให้เกิดการเรนเดอร์ซ้ำและข้อความกระพริบ
   ──────────────────────────────────────────────── */
let cached: Locale | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Locale {
  if (cached) return cached;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    cached = saved === "en" || saved === "th" ? saved : "th";
  } catch {
    cached = "th";
  }
  return cached;
}

function getServerSnapshot(): Locale {
  return "th";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function writeLocale(l: Locale) {
  cached = l;
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {}
  document.documentElement.lang = l;
  listeners.forEach((cb) => cb());
}

const I18nContext = createContext<{
  locale: Locale;
  t: (key: TranslationKey) => string;
  setLocale: (l: Locale) => void;
}>({ locale: "th", t: (k) => dict.th[k], setLocale: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const t = useCallback(
    (key: TranslationKey) => dict[locale][key] ?? dict.th[key],
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, t, setLocale: writeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
