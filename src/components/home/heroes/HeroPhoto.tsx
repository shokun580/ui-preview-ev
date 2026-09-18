"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { evPhoto } from "@/data/images";
import { stationStats } from "@/data/stations";

const trust = [
  { icon: "mapPin" as const, label: "สถานีครบทั้ง 6 ภาค" },
  { icon: "shield" as const, label: "ทีมช่างดูแลถึงหลังติดตั้ง" },
  { icon: "book" as const, label: "อธิบายเรื่องชาร์จให้มือใหม่" },
];

/** แนวทาง 1 — ภาพถ่ายพื้นหลังโทนมืด ข้อความชิดซ้าย (เวอร์ชันที่ใช้อยู่ตอนนี้) */
export function HeroPhoto() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-[var(--rc-ink-950)]">
      {/* ภาพพื้นหลัง ทับด้วยเลเยอร์ไล่สีเพื่อให้ตัวอักษรอ่านได้ชัดทุกจุด */}
      <div className="absolute inset-0">
        <Image
          src={evPhoto(0, 1800, 1000)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--rc-ink-950)] via-[var(--rc-ink-950)]/92 to-[var(--rc-ink-950)]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rc-ink-950)] via-transparent to-transparent" />
      </div>

      {/* แสงเรืองจาง ๆ สองจุด ให้ความรู้สึกพลังงานโดยไม่ต้องใช้สีนีออน */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--rc-mint-400)" }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--rc-cyan-500)" }}
      />

      <div className="shell relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-2xl">
          <p
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.8125rem] text-white backdrop-blur-sm"
            style={{ animation: "rc-fade-up 600ms ease-out both" }}
          >
            <Icon name="bolt" size={14} className="text-[var(--rc-mint-300)]" />
            {t("hero.eyebrow")}
          </p>

          <h1
            className="t-display mt-6 text-white"
            style={{ animation: "rc-fade-up 700ms ease-out 80ms both" }}
          >
            {t("hero.title")}
          </h1>

          <p
            className="t-body-lg mt-5 max-w-xl text-white/72"
            style={{ animation: "rc-fade-up 700ms ease-out 160ms both" }}
          >
            {t("hero.sub")}
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animation: "rc-fade-up 700ms ease-out 240ms both" }}
          >
            <ButtonLink href="/contact" size="lg" iconRight="arrowRight">
              {t("cta.quoteLong")}
            </ButtonLink>
            <ButtonLink href="/stations" size="lg" variant="onDark" icon="mapPin">
              {t("cta.findStation")}
            </ButtonLink>
          </div>

          <ul
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            style={{ animation: "rc-fade-up 700ms ease-out 320ms both" }}
          >
            {trust.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-[0.875rem] text-white/65">
                <Icon name={item.icon} size={16} className="text-[var(--rc-mint-300)]" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* การ์ดสรุปตัวเลข ลอยอยู่มุมขวาบนจอใหญ่ */}
        <div
          className="mt-12 hidden rounded-panel border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md lg:absolute lg:right-8 lg:top-1/2 lg:mt-0 lg:block lg:w-64 lg:-translate-y-1/2"
          style={{ animation: "rc-fade-up 700ms ease-out 400ms both" }}
        >
          <p className="t-overline text-[var(--rc-mint-300)]">ข้อมูลในระบบตอนนี้</p>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-[0.8125rem] text-white/55">สถานีชาร์จ</dt>
              <dd className="t-h2 text-white">{stationStats.stations} แห่ง</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-white/55">หัวชาร์จรวม</dt>
              <dd className="t-h2 text-white">{stationStats.plugs} หัว</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-white/55">ครอบคลุม</dt>
              <dd className="t-h2 text-white">{stationStats.provinces} จังหวัด</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
