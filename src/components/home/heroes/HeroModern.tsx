"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { HeroBand } from "@/components/ui/HeroBand";
import { Marquee } from "@/components/ui/Marquee";
import { WordReveal } from "@/components/ui/WordReveal";
import { Counter } from "@/components/ui/Counter";
import { AppLogo } from "@/components/ui/AppLogo";
import { useI18n } from "@/lib/i18n";
import { chargingApps } from "@/data/apps";
import { stationStats } from "@/data/stations";
import { portfolio } from "@/data/install";
import { HeroStationMap } from "./HeroStationMap";

const stats = [
  { value: stationStats.stations, suffix: " แห่ง", label: "สถานีในระบบ", beam: true },
  { value: stationStats.provinces, suffix: " จังหวัด", label: "ครอบคลุมทั่วไทย" },
  { value: stationStats.networks, suffix: " เครือข่าย", label: "ผู้ให้บริการ" },
  { value: portfolio.length, suffix: " โครงการ", label: "ผลงานติดตั้ง" },
];

/**
 * Hero หน้าแรก
 *
 * สูงเต็มหน้าจอพอดี (หักความสูงของแถบเมนูด้านบนที่ลอยทับอยู่แบบพื้นโปร่ง)
 * ใช้ธีมตามหน้า จึงสว่างในโหมดสว่างและมืดในโหมดมืด ไม่ใช่แถบมืดตายตัวอย่างเดิม
 *
 * เทคนิคที่ใช้ เลือกมาเฉพาะตัวที่ไม่ขัดกับบรีฟ:
 *   • ลายตารางไล่จางออกขอบ แทนภาพถ่ายสต๊อก
 *   • หัวเรื่องค่อย ๆ ชัดขึ้นทีละวรรค พร้อมหนึ่งวรรคที่ไล่สีเคลื่อนช้า ๆ
 *   • แสงกวาดผ่านปุ่มหลักเป็นจังหวะ
 *   • การ์ดตัวเลขแบบ bento ใบแรกมีเส้นแสงวิ่งรอบขอบ
 *   • แถบโลโก้เครือข่ายเลื่อนต่อเนื่อง ซึ่งเป็นเนื้อหาที่มีประโยชน์จริง ไม่ใช่ของประดับ
 *
 * ตั้งใจไม่ใส่ meteors / particles / light rays เพราะจะกลายเป็นหน้าจอเกมทันที
 */
export function HeroModern() {
  const { t } = useI18n();

  return (
    <HeroBand underHeader className="min-h-svh">
      <div className="shell flex flex-1 items-center py-10 sm:py-12 xl:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-7">
            <p
              className="rc-blur-in inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-[0.8125rem] text-fg-muted backdrop-blur-sm"
              style={{ animationDelay: "60ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-accent"
                  style={{ animation: "rc-pulse-ring 2.4s ease-out infinite" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t("hero.eyebrow")}
            </p>

            <h1 className="t-display mt-6">
              <WordReveal text="ชาร์จที่ไหนก็ได้" delay={180} />
              <br />
              <span
                className="rc-blur-in rc-aurora inline-block"
                style={{ animationDelay: "320ms" }}
              >
                ติดตั้งที่บ้านคุณก็ได้
              </span>
            </h1>

            <p
              className="rc-blur-in t-body-lg mt-6 max-w-xl text-fg-muted xl:mt-7 xl:max-w-2xl xl:text-[1.3125rem]"
              style={{ animationDelay: "440ms" }}
            >
              {t("hero.sub")}
            </p>

            <div
              className="rc-blur-in mt-9 flex flex-col gap-3 sm:flex-row xl:mt-11"
              style={{ animationDelay: "560ms" }}
            >
              <ButtonLink
                href="/contact"
                size="lg"
                iconRight="arrowRight"
                className="rc-shine"
              >
                {t("cta.quoteLong")}
              </ButtonLink>
              <ButtonLink href="/stations" size="lg" variant="secondary" icon="mapPin">
                {t("cta.findStation")}
              </ButtonLink>
            </div>

            {/* การ์ดตัวเลขแบบ bento — ใบแรกเน้นด้วยเส้นแสงวิ่งรอบขอบ */}
            <dl
              className="rc-blur-in mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:mt-14 xl:gap-4"
              style={{ animationDelay: "680ms" }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-sm xl:p-5 ${s.beam ? "rc-beam" : ""}`}
                >
                  <dd className="t-h3 t-num font-bold leading-none text-fg xl:text-[1.75rem]">
                    <Counter to={s.value} />
                    <span className="text-[0.8125rem] font-normal text-fg-muted">
                      {s.suffix}
                    </span>
                  </dd>
                  <dt className="mt-1.5 text-[0.75rem] text-fg-faint xl:mt-2 xl:text-[0.8125rem]">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* แผนที่จริงเป็นภาพหลัก แทนภาพถ่ายสต๊อก */}
          <div
            className="rc-blur-in relative lg:col-span-5"
            style={{ animationDelay: "400ms" }}
          >
            <div className="mx-auto h-[17rem] w-full max-w-xs sm:h-[22rem] sm:max-w-sm lg:h-[32rem] lg:max-w-none xl:h-[40rem]">
              <HeroStationMap />
            </div>
          </div>
        </div>
      </div>

      {/* แถบเครือข่าย — เนื้อหาที่มีประโยชน์จริง ไม่ใช่ลวดลายประดับ */}
      <div
        className="rc-blur-in shrink-0 border-t border-border py-5 xl:py-7"
        style={{ animationDelay: "800ms" }}
      >
        <p className="t-caption mb-3.5 text-center">
          รวมสถานีจากเครือข่ายที่คนไทยใช้จริง
        </p>
        <Marquee duration={44}>
          {chargingApps.map((app) => (
            <Link
              key={app.id}
              href={`/guide#app-${app.id}`}
              className="mx-3 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 py-2 pl-2 pr-5 transition-colors hover:border-border-strong hover:bg-surface"
            >
              <AppLogo id={app.id} name={app.name} size={30} />
              <span className="whitespace-nowrap text-[0.875rem] text-fg-muted">
                {app.name}
              </span>
            </Link>
          ))}
        </Marquee>
      </div>
    </HeroBand>
  );
}
