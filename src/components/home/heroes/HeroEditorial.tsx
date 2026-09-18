"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { evPhoto, installPhoto, stationPhoto } from "@/data/images";
import { stationStats } from "@/data/stations";

/**
 * แนวทาง 4 — โทนสว่างแบบนิตยสาร
 * เน้นตัวอักษรใหญ่และที่ว่าง ให้ความรู้สึกพรีเมียมแบบสะอาด
 * เหมาะถ้าอยากให้ทั้งเว็บสว่างต่อเนื่องกัน ไม่ตัดเป็นแถบมืดตั้งแต่หน้าจอแรก
 */
export function HeroEditorial() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-bg">
      {/* แสงไล่สีจาง ๆ มุมขวาบน ให้พื้นขาวไม่แบนจนเกินไป */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "var(--rc-gradient)" }}
      />

      <div className="shell relative grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-6">
          <p
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[0.8125rem] text-fg-muted"
            style={{ animation: "rc-fade-up 600ms ease-out both" }}
          >
            <Icon name="bolt" size={14} className="text-accent" />
            {t("hero.eyebrow")}
          </p>

          <h1
            className="t-display mt-6"
            style={{ animation: "rc-fade-up 700ms ease-out 80ms both" }}
          >
            ชาร์จที่ไหนก็ได้
            <br />
            <span className="brand-gradient-text">ติดตั้งที่บ้านคุณก็ได้</span>
          </h1>

          <p
            className="t-body-lg mt-6 max-w-lg text-fg-muted"
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
            <ButtonLink href="/stations" size="lg" variant="secondary" icon="mapPin">
              {t("cta.findStation")}
            </ButtonLink>
          </div>

          <dl
            className="mt-11 flex flex-wrap gap-x-10 gap-y-5 border-t border-border pt-7"
            style={{ animation: "rc-fade-up 700ms ease-out 320ms both" }}
          >
            {[
              { v: `${stationStats.stations}`, l: "สถานีในระบบ" },
              { v: `${stationStats.provinces}`, l: "จังหวัดที่ครอบคลุม" },
              { v: `${stationStats.networks}`, l: "เครือข่ายผู้ให้บริการ" },
            ].map((s) => (
              <div key={s.l}>
                <dd className="t-h1 t-num leading-none">{s.v}</dd>
                <dt className="t-caption mt-1.5">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* คอลลาจภาพ — ภาพใหญ่หนึ่งใบคู่กับภาพเล็กสองใบ ให้จังหวะสายตาไม่นิ่งจนเกินไป */}
        <div
          className="lg:col-span-6"
          style={{ animation: "rc-fade-up 900ms ease-out 200ms both" }}
        >
          <div className="grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4 lg:h-[30rem]">
            <div className="relative col-span-3 row-span-6 overflow-hidden rounded-panel bg-surface-sunken">
              <Image
                src={evPhoto(0, 800, 1100)}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-panel bg-surface-sunken">
              <Image
                src={stationPhoto(3, 700, 700)}
                alt=""
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-panel bg-surface-sunken">
              <Image
                src={installPhoto(1, 700, 700)}
                alt=""
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
              <span className="absolute inset-x-3 bottom-3 rounded-xl bg-bg/90 px-3 py-2 backdrop-blur">
                <span className="block text-[0.75rem] text-fg">
                  ทีมช่างดูแลถึงหลังติดตั้ง
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
