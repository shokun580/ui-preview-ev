"use client";

import { useState } from "react";
import { chargerOptions, services, type Segment } from "@/data/install";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const serviceIcons: Record<string, IconName> = {
  survey: "survey",
  home: "home",
  building: "building",
  permit: "permit",
  wrench: "wrench",
  dashboard: "dashboard",
};

const segments: Array<{
  id: Segment;
  label: string;
  icon: IconName;
  headline: string;
  body: string;
}> = [
  {
    id: "home",
    label: "สำหรับบ้าน",
    icon: "home",
    headline: "ชาร์จข้ามคืนที่บ้าน ตื่นมาก็เต็ม",
    body: "บ้านเดี่ยว ทาวน์โฮม หรือบ้านที่จอดรถในที่ร่ม เราช่วยดูตั้งแต่ขนาดมิเตอร์เดิมว่าพอไหม ต้องขยายหรือเปล่า จนถึงเลือกเครื่องที่เหมาะกับรถของคุณ",
  },
  {
    id: "business",
    label: "สำหรับธุรกิจ",
    icon: "building",
    headline: "เปิดสถานีชาร์จในพื้นที่ของคุณเอง",
    body: "ห้าง โรงแรม คอนโด อาคารสำนักงาน โรงงาน หรือปั๊มน้ำมัน เราออกแบบตั้งแต่ผังช่องจอด กำลังไฟที่เหมาะสม ไปจนถึงระบบคิดเงินและรายงานการใช้งาน",
  },
];

export function InstallTabs({ initial = "home" }: { initial?: Segment }) {
  const [seg, setSeg] = useState<Segment>(initial);
  const current = segments.find((s) => s.id === seg)!;
  const segServices = services.filter((s) => s.segments.includes(seg));
  const segChargers = chargerOptions.filter((c) => c.segment === seg);

  return (
    <div id="services" className="scroll-mt-24">
      {/* ปุ่มสลับกลุ่ม — ทำให้ใหญ่และชัด เพราะเนื้อหาสองฝั่งต่างกันมาก */}
      <div className="mx-auto mb-10 grid max-w-md grid-cols-2 gap-1.5 rounded-full border border-border bg-surface-sunken p-1.5">
        {segments.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSeg(s.id)}
            aria-pressed={seg === s.id}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[0.9375rem] font-bold transition-all duration-200",
              seg === s.id
                ? "bg-surface text-brand shadow-card"
                : "text-fg-muted hover:text-fg",
            )}
          >
            <Icon name={s.icon} size={18} />
            {s.label}
          </button>
        ))}
      </div>

      <div key={seg} style={{ animation: "rc-fade-up 380ms ease-out both" }}>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="t-h2">{current.headline}</h2>
          <p className="t-body mt-3 text-fg-muted">{current.body}</p>
        </div>

        {/* บริการที่เกี่ยวข้อง */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {segServices.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80}>
              <article className="flex h-full flex-col rounded-card border border-border bg-surface p-6 transition-shadow hover:shadow-card-hover">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand-soft-fg">
                  <Icon name={serviceIcons[s.icon]} size={22} />
                </span>
                <h3 className="t-h3 mt-4">{s.title}</h3>
                <p className="t-body-sm mt-2 text-fg-muted">{s.body}</p>
                <ul className="mt-4 space-y-2 border-t border-border pt-4">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[0.875rem] text-fg-muted">
                      <Icon name="check" size={16} className="mt-1 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ตัวเลือกเครื่องชาร์จ */}
        <div className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="t-h3">ตัวเลือกเครื่องชาร์จที่เหมาะกับ{current.label.replace("สำหรับ", "")}</h3>
              <p className="t-body-sm mt-1 text-fg-muted">
                เลือกรุ่นจริงอีกครั้งหลังสำรวจหน้างาน เพราะขึ้นกับระบบไฟที่มีอยู่
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {segChargers.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <div className="flex h-full gap-4 rounded-card border border-border bg-surface p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl brand-gradient-bg text-white">
                    <Icon name="plug" size={22} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[1rem] font-bold text-fg">{c.name}</h4>
                    <Badge tone="outline" className="mt-1.5">{c.for}</Badge>
                    <p className="t-body-sm mt-2.5 text-fg-muted">{c.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="t-caption mt-4">
            ยังไม่ได้ระบุยี่ห้อเครื่องชาร์จในต้นแบบนี้
            เพราะแบรนด์ที่จำหน่ายจริงต้องยืนยันกับทีมงานอีกครั้ง
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact" size="lg" iconRight="arrowRight">
            ขอใบเสนอราคา{current.label.replace("สำหรับ", "")}
          </ButtonLink>
          <ButtonLink href="#process" size="lg" variant="secondary">
            ดูขั้นตอนการทำงาน
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
