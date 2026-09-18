"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { installPhoto } from "@/data/images";
import { stationStats } from "@/data/stations";
import { portfolio } from "@/data/install";
import { HeroStationMap } from "./HeroStationMap";

type Door = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  icon: IconName;
  facts: string[];
};

const doors: Door[] = [
  {
    href: "/stations",
    eyebrow: "ฉันขับรถ EV",
    title: "หาที่ชาร์จ",
    body: "ดูสถานีทั่วไทยจากแผนที่เดียว กรองตามหัวชาร์จ ความเร็ว และสถานะว่างได้ทันที",
    cta: "เปิดแผนที่สถานีชาร์จ",
    icon: "bolt",
    facts: [`${stationStats.stations} สถานี`, `${stationStats.provinces} จังหวัด`, "อัปเดตจากทีมสำรวจ"],
  },
  {
    href: "/install",
    eyebrow: "ฉันอยากมีเครื่องชาร์จ",
    title: "ติดตั้งที่ของคุณ",
    body: "บ้าน ห้าง โรงแรม หรือโรงงาน เราดูให้ตั้งแต่ระบบไฟหน้างานจนถึงดูแลหลังส่งมอบ",
    cta: "ขอใบเสนอราคา",
    icon: "wrench",
    facts: ["สำรวจหน้างานฟรี", "ประสานการไฟฟ้าให้", `ผลงาน ${portfolio.length} โครงการ`],
  },
];

/**
 * แนวทาง 3 — "สองประตู"
 * เว็บนี้มีผู้ใช้สองกลุ่มที่สำคัญเท่ากัน (คนขับ EV กับคนอยากติดตั้ง)
 * แทนที่จะพยายามพูดกับทั้งสองกลุ่มด้วยข้อความเดียว ก็ให้เขาเลือกเองตั้งแต่หน้าจอแรก
 */
export function HeroTwoDoor() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-[var(--rc-ink-950)]">
      <div className="absolute inset-0 opacity-[0.55]">
        <HeroStationMap variant="onDark" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--rc-ink-950)]/80 via-[var(--rc-ink-950)]/92 to-[var(--rc-ink-950)]" />

      <div className="shell relative py-14 sm:py-16 lg:py-20">
        <div
          className="mx-auto max-w-2xl text-center"
          style={{ animation: "rc-fade-up 650ms ease-out both" }}
        >
          <p className="t-overline text-[var(--rc-mint-300)]">{t("hero.eyebrow")}</p>
          <h1 className="t-display mt-4 text-white">{t("hero.title")}</h1>
          <p className="t-body-lg mt-4 text-white/65">
            เลือกได้เลยว่าคุณมาด้วยเรื่องไหน แล้วเราจะพาไปตรงจุด
          </p>
        </div>

        <div className="mt-11 grid gap-4 md:grid-cols-2 md:gap-5">
          {doors.map((d, i) => (
            <Link
              key={d.href}
              href={d.href}
              className="group relative flex flex-col overflow-hidden rounded-panel border border-white/12 bg-white/[0.05] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--rc-mint-300)]/50 hover:bg-white/[0.09] sm:p-8"
              style={{ animation: `rc-fade-up 700ms ease-out ${180 + i * 110}ms both` }}
            >
              {i === 1 && (
                <div className="pointer-events-none absolute inset-0">
                  <Image
                    src={installPhoto(0, 900, 700)}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-[0.22]"
                  />
                  {/* ทับด้วยไล่สีเข้ม ไม่งั้นตัวหนังสือจะไปอยู่บนรายละเอียดของรูปจนอ่านยาก */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--rc-ink-950)] via-[var(--rc-ink-950)]/88 to-[var(--rc-ink-950)]/45" />
                </div>
              )}

              <div className="relative flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl brand-gradient-bg text-white">
                  <Icon name={d.icon} size={24} />
                </span>
                <span className="text-[0.8125rem] text-[var(--rc-mint-300)]">
                  {d.eyebrow}
                </span>
              </div>

              <h2 className="t-h1 relative mt-5 text-white">{d.title}</h2>
              <p className="t-body relative mt-3 text-white/65">{d.body}</p>

              <ul className="relative mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {d.facts.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-[0.8125rem] text-white/50">
                    <Icon name="check" size={14} className="text-[var(--rc-mint-300)]" />
                    {f}
                  </li>
                ))}
              </ul>

              <span className="t-button relative mt-7 inline-flex items-center gap-2 text-white">
                {d.cta}
                <Icon
                  name="arrowRight"
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </span>
            </Link>
          ))}
        </div>

        <p className="relative mt-8 text-center text-[0.875rem] text-white/45">
          ยังไม่แน่ใจว่าเริ่มตรงไหน?{" "}
          <Link href="/guide" className="font-bold text-white/80 underline-offset-4 hover:underline">
            อ่านคู่มือสำหรับมือใหม่
          </Link>
        </p>
      </div>
    </section>
  );
}
