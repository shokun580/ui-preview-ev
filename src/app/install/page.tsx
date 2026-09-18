import type { Metadata } from "next";
import { InstallTabs } from "@/components/install/InstallTabs";
import { PortfolioGrid } from "@/components/install/PortfolioGrid";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { HeroBand } from "@/components/ui/HeroBand";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { installFaq, processSteps, type Segment } from "@/data/install";

export const metadata: Metadata = {
  title: "ติดตั้งสถานีชาร์จ",
  description:
    "บริการออกแบบและติดตั้งเครื่องชาร์จรถ EV สำหรับบ้านและธุรกิจ ตั้งแต่สำรวจหน้างาน ประสานงานการไฟฟ้า ติดตั้ง ทดสอบ จนถึงดูแลหลังส่งมอบ",
};

export default async function InstallPage({
  searchParams,
}: {
  searchParams: Promise<{ seg?: string }>;
}) {
  const { seg } = await searchParams;
  const initial: Segment = seg === "business" ? "business" : "home";

  return (
    <div className="pb-24 md:pb-16">
      {/* ── หัวหน้า ── */}
      <HeroBand className="py-14 sm:py-18">
        <div className="shell max-w-3xl">
          <Badge tone="accent">
            บริการติดตั้ง
          </Badge>
          <h1 className="t-h1 mt-4">
            ติดตั้งเครื่องชาร์จ ตั้งแต่บ้านหลังเดียวถึงสถานีเชิงพาณิชย์
          </h1>
          <p className="t-body-lg mt-4 text-fg-muted">
            เราไม่ได้ขายแค่เครื่อง แต่ดูทั้งระบบไฟของหน้างาน ว่ารองรับได้แค่ไหน
            ต้องปรับอะไรก่อน และเมื่อติดตั้งแล้วจะดูแลกันต่ออย่างไร
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/contact" size="lg" iconRight="arrowRight">
              ขอใบเสนอราคา
            </ButtonLink>
            <ButtonLink href="#portfolio" size="lg" variant="secondary">
              ดูตัวอย่างหน้างาน
            </ButtonLink>
          </div>

          <p className="t-caption mt-6 flex items-center gap-2">
            <Icon name="info" size={15} />
            ราคาขึ้นกับรุ่นเครื่อง ระยะเดินสาย และงานปรับปรุงระบบไฟ จึงต้องสำรวจหน้างานก่อนเสนอราคา
          </p>
        </div>
      </HeroBand>

      {/* ── บริการ แยกตามกลุ่ม ── */}
      <section className="bg-bg py-16 sm:py-20">
        <div className="shell">
          <InstallTabs initial={initial} />
        </div>
      </section>

      {/* ── ขั้นตอนการทำงาน ── */}
      <section id="process" className="scroll-mt-24 bg-bg-subtle py-16 sm:py-20">
        <div className="shell">
          <SectionHead
            eyebrow="ขั้นตอนการทำงาน"
            title="ตั้งแต่ทักมาจนใช้งานได้จริง 4 ขั้นตอน"
            sub="ปรึกษาและประเมินเบื้องต้นไม่มีค่าใช้จ่าย จะตัดสินใจต่อหรือไม่ก็ได้"
            align="center"
          />

          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100} as="li">
                <div className="flex h-full flex-col rounded-card border border-border bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full brand-gradient-bg text-[1rem] font-bold text-white">
                      {s.n}
                    </span>
                    <Badge tone="outline">
                      <Icon name="clock" size={12} />
                      {s.duration}
                    </Badge>
                  </div>
                  <h3 className="t-h3 mt-4">{s.title}</h3>
                  <p className="t-body-sm mt-2 text-fg-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ตัวอย่างหน้างาน ── */}
      <section id="portfolio" className="scroll-mt-24 bg-bg py-16 sm:py-20">
        <div className="shell">
          <SectionHead
            eyebrow="ผลงาน"
            title="ตัวอย่างหน้างานสถานีชาร์จ"
            sub="กรองดูตามประเภทพื้นที่ เพื่อดูงานที่ใกล้เคียงกับของคุณมากที่สุด"
          />
          <PortfolioGrid />
        </div>
      </section>

      {/* ── คำถามที่พบบ่อย ── */}
      <section className="bg-bg-subtle py-16 sm:py-20">
        <div className="shell max-w-3xl">
          <SectionHead
            eyebrow="คำถามที่พบบ่อย"
            title="เรื่องที่ลูกค้าถามก่อนตัดสินใจ"
            align="center"
          />
          <Accordion items={installFaq} />

          <div className="mt-10 rounded-panel brand-gradient-bg p-7 text-center sm:p-9">
            <h2 className="t-h2 text-white">ยังไม่แน่ใจว่าบ้านหรืออาคารรองรับได้ไหม</h2>
            <p className="t-body mx-auto mt-3 max-w-lg text-white/85">
              ส่งรูปตู้ไฟ ขนาดมิเตอร์ และรุ่นรถมาให้ทีมงานดูก่อน เราตอบกลับภายใน 1 วันทำการ
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/contact"
                size="lg"
                variant="onColor"
                iconRight="arrowRight"
              >
                ปรึกษาฟรี
              </ButtonLink>
              <ButtonLink href="/stations" size="lg" variant="secondary" icon="mapPin">
                ดูสถานีชาร์จใกล้ฉัน
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
