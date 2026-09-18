import type { Metadata } from "next";
import Link from "next/link";
import { AppQuiz } from "@/components/guide/AppQuiz";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { AppLogo } from "@/components/ui/AppLogo";
import { HeroBand } from "@/components/ui/HeroBand";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { chargingApps, chargingSteps } from "@/data/apps";
import { connectorInfo, type ConnectorType } from "@/data/stations";
import { posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "รู้จักวิธีใช้งาน",
  description:
    "5 ขั้นตอนการชาร์จรถ EV ครั้งแรก พร้อมแบบทดสอบช่วยเลือกว่าควรโหลดแอปชาร์จตัวไหน และรายละเอียดของแอปทั้ง 10 ตัวในไทย",
};

export default function GuidePage() {
  return (
    <div className="pb-24 md:pb-16">
      {/* ── หัวหน้า ── */}
      <HeroBand className="py-14 sm:py-18">
        <div className="shell max-w-3xl">
          <Badge tone="accent">
            สำหรับมือใหม่
          </Badge>
          <h1 className="t-h1 mt-4">
            เพิ่งได้รถ EV มา แล้วชาร์จยังไง
          </h1>
          <p className="t-body-lg mt-4 text-fg-muted">
            หน้านี้พาไปทีละขั้นตั้งแต่ก่อนออกจากบ้าน จนถึงตอนถอดสายกลับ
            พร้อมช่วยเลือกว่าควรโหลดแอปของเครือข่ายไหนไว้บ้าง
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#quiz" size="lg" iconRight="arrowRight">
              ทำแบบทดสอบหาแอปที่ใช่
            </ButtonLink>
            <ButtonLink href="/stations" size="lg" variant="secondary" icon="mapPin">
              ค้นหาสถานีใกล้ฉัน
            </ButtonLink>
          </div>
        </div>
      </HeroBand>

      {/* ── 5 ขั้นตอน ── */}
      <section className="bg-bg py-16 sm:py-20">
        <div className="shell">
          <SectionHead
            eyebrow="ขั้นตอนพื้นฐาน"
            title="ชาร์จครั้งแรก ทำอะไรบ้าง"
            sub="ทั้งหมด 5 ขั้นตอน ทำตามนี้แล้วจะชาร์จที่สถานีไหนก็ได้"
          />

          <ol className="space-y-4">
            {chargingSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} as="li">
                <div className="flex gap-4 rounded-card border border-border bg-surface p-5 transition-shadow hover:shadow-card-hover sm:gap-6 sm:p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl brand-gradient-bg text-[1.125rem] font-bold text-white sm:h-14 sm:w-14 sm:text-[1.375rem]">
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="t-h3">{s.title}</h3>
                    <p className="t-body mt-2 text-fg-muted">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* หัวชาร์จ 3 แบบ */}
          <Reveal>
            <div className="mt-10 rounded-panel border border-border bg-bg-subtle p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="t-h3">หัวชาร์จ 3 แบบที่เจอในไทย</h3>
                  <p className="t-body-sm mt-1 text-fg-muted">
                    ดูฝาช่องชาร์จข้างรถแล้วเทียบกับภาพนี้ได้เลย
                  </p>
                </div>
                <Link
                  href="/blog/connector-types"
                  className="t-button inline-flex items-center gap-1.5 text-brand hover:underline"
                >
                  อ่านฉบับละเอียด
                  <Icon name="arrowRight" size={16} />
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {(Object.keys(connectorInfo) as ConnectorType[]).map((c) => (
                  <div key={c} className="rounded-card border border-border bg-surface p-5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-soft-fg">
                        <Icon name="plug" size={19} />
                      </span>
                      <div>
                        <p className="text-[1rem] font-bold text-fg">{c}</p>
                        <Badge tone={connectorInfo[c].current === "DC" ? "brand" : "neutral"}>
                          {connectorInfo[c].current}
                        </Badge>
                      </div>
                    </div>
                    <p className="t-body-sm mt-3 text-fg-muted">{connectorInfo[c].note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── แบบทดสอบ ── */}
      <section id="quiz" className="scroll-mt-24 bg-bg-subtle py-16 sm:py-20">
        <div className="shell max-w-3xl">
          <SectionHead
            eyebrow="แบบทดสอบ 5 ข้อ"
            title="ควรโหลดแอปไหนดี"
            sub="ตอบ 5 คำถามสั้น ๆ แล้วเราจะช่วยจัดอันดับให้ว่าแอปไหนน่าจะเหมาะกับการใช้งานของคุณที่สุด"
            align="center"
          />
          <AppQuiz />
        </div>
      </section>

      {/* ── แอปทั้ง 10 ── */}
      <section id="apps" className="scroll-mt-24 bg-bg py-16 sm:py-20">
        <div className="shell">
          <SectionHead
            eyebrow="แอปพลิเคชัน"
            title="แอปชาร์จในไทยทั้ง 10 ตัว"
            sub="แต่ละเครือข่ายใช้แอปของตัวเอง การมีไว้ 2–3 ตัวที่ครอบคลุมเส้นทางที่ขับประจำมักเพียงพอ"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {chargingApps.map((app, i) => (
              <Reveal key={app.id} delay={(i % 2) * 80}>
                <article
                  id={`app-${app.id}`}
                  className="flex h-full scroll-mt-24 flex-col rounded-card border border-border bg-surface p-5 transition-shadow hover:shadow-card-hover sm:p-6"
                >
                  <div className="flex items-start gap-3.5">
                    <AppLogo id={app.id} name={app.name} size={48} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="t-h3">{app.name}</h3>
                        {app.isDirectory && <Badge tone="outline">แอปดูแผนที่</Badge>}
                      </div>
                      <p className="t-caption">{app.operator}</p>
                    </div>
                  </div>

                  <p className="t-body-sm mt-3 text-fg-muted">{app.tagline}</p>

                  <ul className="mt-4 space-y-2">
                    {app.strengths.map((s) => (
                      <li key={s} className="flex gap-2 text-[0.875rem] text-fg-muted">
                        <Icon name="check" size={16} className="mt-1 shrink-0 text-accent" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-5 space-y-2 border-t border-border pt-4 text-[0.8125rem]">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-fg-faint">ครอบคลุม</dt>
                      <dd className="text-fg-muted">{app.coverage}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-fg-faint">หัวชาร์จ</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {app.connectors.map((c) => (
                          <Badge key={c} tone="outline">{c}</Badge>
                        ))}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-fg-faint">จ่ายเงิน</dt>
                      <dd className="text-fg-muted">{app.payment.join(" · ")}</dd>
                    </div>
                  </dl>

                  <p className="mt-4 rounded-xl bg-brand-soft px-3.5 py-2.5 text-[0.8125rem] text-brand-soft-fg">
                    <strong className="font-bold">เหมาะกับ:</strong> {app.bestFor}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="t-caption mt-6 text-center">
            รายละเอียดจำนวนสถานีและวิธีจ่ายเงินเป็นข้อมูลตัวอย่างสำหรับต้นแบบนี้
            ควรตรวจสอบกับผู้ให้บริการอีกครั้งก่อนใช้งานจริง
          </p>
        </div>
      </section>

      {/* ── อ่านต่อ ── */}
      <section className="bg-bg-subtle py-16 sm:py-20">
        <div className="shell">
          <SectionHead
            eyebrow="อ่านต่อ"
            title="อยากเข้าใจลึกกว่านี้"
            action={
              <ButtonLink href="/blog" variant="secondary" iconRight="arrowRight">
                ดูบทความทั้งหมด
              </ButtonLink>
            }
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col rounded-card border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <Badge tone="accent" className="self-start">{p.category}</Badge>
                  <h3 className="t-h3 mt-3">{p.title}</h3>
                  <p className="t-body-sm mt-2 line-clamp-2 text-fg-muted">{p.excerpt}</p>
                  <span className="t-button mt-auto inline-flex items-center gap-1.5 pt-4 text-brand">
                    อ่านต่อ
                    <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
