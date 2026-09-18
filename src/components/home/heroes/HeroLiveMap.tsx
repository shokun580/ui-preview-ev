"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { stationStats } from "@/data/stations";
import { HeroStationMap } from "./HeroStationMap";

const quickProvinces = [
  { id: "bangkok", label: "กรุงเทพฯ" },
  { id: "chonburi", label: "ชลบุรี" },
  { id: "chiang-mai", label: "เชียงใหม่" },
  { id: "phuket", label: "ภูเก็ต" },
  { id: "khon-kaen", label: "ขอนแก่น" },
];

/**
 * แนวทาง 2 — แบ่งครึ่ง: ข้อความซ้าย แผนที่จริงขวา
 * ใช้ข้อมูลของตัวเองเป็นภาพหลักแทนภาพสต๊อก คนเห็นแล้วรู้ทันทีว่าเว็บนี้มีข้อมูลสถานีจริง
 */
export function HeroLiveMap() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-[var(--rc-ink-950)]">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--rc-mint-400)" }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[32rem] w-[32rem] rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "var(--rc-cyan-500)" }}
      />

      <div className="shell relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-7">
          <p
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.8125rem] text-white backdrop-blur-sm"
            style={{ animation: "rc-fade-up 600ms ease-out both" }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-[var(--rc-mint-300)]"
                style={{ animation: "rc-pulse-ring 2.4s ease-out infinite" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--rc-mint-300)]" />
            </span>
            ข้อมูลสถานี {stationStats.stations} แห่ง ครอบคลุม {stationStats.provinces} จังหวัด
          </p>

          <h1
            className="t-display mt-6 text-white"
            style={{ animation: "rc-fade-up 700ms ease-out 80ms both" }}
          >
            {t("hero.title")}
          </h1>

          <p
            className="t-body-lg mt-5 max-w-xl text-white/70"
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

          {/* ทางลัดไปยังจังหวัดที่คนค้นบ่อย — ลดจำนวนคลิกกว่าจะถึงผลลัพธ์ */}
          <div
            className="mt-8"
            style={{ animation: "rc-fade-up 700ms ease-out 320ms both" }}
          >
            <p className="t-caption mb-2.5 text-white/45">ดูสถานีในจังหวัดยอดนิยม</p>
            <div className="flex flex-wrap gap-2">
              {quickProvinces.map((p) => (
                <a
                  key={p.id}
                  href={`/stations?province=${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[0.8125rem] text-white/75 transition-colors hover:border-[var(--rc-mint-300)] hover:bg-white/10 hover:text-white"
                >
                  <Icon name="mapPin" size={14} />
                  {p.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative lg:col-span-5"
          style={{ animation: "rc-fade-up 900ms ease-out 200ms both" }}
        >
          <div className="mx-auto h-[20rem] w-full max-w-sm sm:h-[26rem] lg:h-[34rem] lg:max-w-none">
            <HeroStationMap variant="onDark" />
          </div>

          <div className="absolute bottom-0 left-0 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur-md sm:left-4">
            <p className="t-num text-[1.5rem] font-bold leading-none text-white">
              {stationStats.plugs}
            </p>
            <p className="text-[0.75rem] text-white/55">หัวชาร์จในระบบ</p>
          </div>
        </div>
      </div>
    </section>
  );
}
