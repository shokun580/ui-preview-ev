import Image from "next/image";
import Link from "next/link";
import { HeroModern } from "@/components/home/heroes";
import { StatsBar } from "@/components/home/StatsBar";
import { MapSection } from "@/components/home/MapSection";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { AppLogo } from "@/components/ui/AppLogo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { chargingApps, chargingSteps } from "@/data/apps";
import { portfolio, portfolioTypeLabels, processSteps, services } from "@/data/install";
import { posts } from "@/data/posts";
import { aboutParagraphs, valueProps } from "@/data/site";
import { formatThaiDate } from "@/lib/utils";

const valueIcons: Record<string, IconName> = { map: "map", book: "book", wrench: "wrench" };

const serviceIcons: Record<string, IconName> = {
  survey: "survey",
  home: "home",
  building: "building",
  permit: "permit",
  wrench: "wrench",
  dashboard: "dashboard",
};

/** 3 การ์ดบริการบนหน้าแรก: บ้าน / ธุรกิจ / ดูแลหลังติดตั้ง */
const homeServiceCards = [
  { id: "home-install", tag: "สำหรับบ้าน", href: "/install?seg=home" },
  { id: "commercial", tag: "สำหรับธุรกิจ", href: "/install?seg=business" },
  { id: "maintenance", tag: "หลังติดตั้ง", href: "/install#services" },
].map((c) => ({ ...c, service: services.find((s) => s.id === c.id)! }));

export default function HomePage() {
  return (
    <>
      <HeroModern />
      <StatsBar />

      {/* ── สามเรื่องที่เว็บนี้ช่วยได้ ── */}
      <section className="bg-bg py-16 sm:py-20">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-3">
            {valueProps.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="h-full rounded-card border border-border bg-surface p-6 transition-shadow hover:shadow-card-hover">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand-soft-fg">
                    <Icon name={valueIcons[v.icon]} size={22} />
                  </span>
                  <h3 className="t-h3 mt-4">{v.title}</h3>
                  <p className="t-body-sm mt-2 text-fg-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MapSection />

      {/* ── ชาร์จครั้งแรก? เริ่มที่นี่ ──
          อยู่โซนสีจางต่อจากแผนที่ ไม่ตัดเป็นแถบมืดคั่นกลางหน้า
          ทั้งหน้าจึงมีพื้นมืดแค่จุดเดียวคือ Hero */}
      <section className="bg-bg-subtle pb-16 sm:pb-20 lg:pb-24">
        <div className="shell">
          <SectionHead
            eyebrow="สำหรับมือใหม่"
            title="ชาร์จครั้งแรก? เริ่มที่นี่"
            sub="5 ขั้นตอนตั้งแต่เตรียมแอปก่อนออกรถ จนถึงถอดสายกลับบ้าน อ่านจบใน 3 นาที"
            action={
              <ButtonLink href="/guide" variant="secondary" iconRight="arrowRight">
                อ่านคู่มือฉบับเต็ม
              </ButtonLink>
            }
          />

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {chargingSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} as="li">
                <div className="h-full rounded-card border border-border bg-surface p-5 transition-shadow hover:shadow-card-hover">
                  <span className="t-h3 brand-gradient-text font-bold">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[1rem] font-bold leading-snug text-fg">{s.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── แอปชาร์จที่ควรรู้จัก ── */}
      <section className="bg-bg py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <SectionHead
            eyebrow="แอปพลิเคชัน"
            title="แอปชาร์จที่ควรรู้จัก"
            sub="เมืองไทยมีเครือข่ายชาร์จหลายเจ้าและแต่ละเจ้าใช้แอปคนละตัว ดูว่าแต่ละแอปเด่นเรื่องอะไร หรือทำแบบทดสอบให้เราช่วยเลือกให้"
            action={
              <ButtonLink href="/guide#quiz" variant="secondary" iconRight="arrowRight">
                ทำแบบทดสอบหาแอปที่ใช่
              </ButtonLink>
            }
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {chargingApps.map((app, i) => (
              <Reveal key={app.id} delay={i * 45}>
                <Link
                  href={`/guide#app-${app.id}`}
                  className="flex h-full flex-col items-center gap-2.5 rounded-card border border-border bg-surface p-4 text-center transition-all hover:-translate-y-1 hover:border-border-strong hover:shadow-card-hover"
                >
                  <AppLogo id={app.id} name={app.name} size={48} />
                  <span className="text-[0.875rem] font-bold leading-tight text-fg">{app.name}</span>
                  <span className="t-caption line-clamp-2 leading-snug">{app.tagline}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── บริการติดตั้ง ── */}
      <section className="bg-bg pb-16 sm:pb-20 lg:pb-24">
        <div className="shell">
          <SectionHead
            eyebrow="บริการของเรา"
            title="ติดตั้งเครื่องชาร์จ ตั้งแต่บ้านหลังเดียวถึงสถานีเชิงพาณิชย์"
            sub="ทีมงานดูแลตั้งแต่สำรวจระบบไฟหน้างาน ประสานงานการไฟฟ้า ติดตั้ง ทดสอบ จนถึงการดูแลหลังส่งมอบ"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {homeServiceCards.map((card, i) => (
              <Reveal key={card.id} delay={i * 90}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-card border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl brand-gradient-bg text-white">
                      <Icon name={serviceIcons[card.service.icon]} size={21} />
                    </span>
                    <Badge tone="brand">{card.tag}</Badge>
                  </div>
                  <h3 className="t-h3 mt-4">{card.service.title}</h3>
                  <p className="t-body-sm mt-2 text-fg-muted">{card.service.body}</p>
                  <ul className="mt-4 space-y-2">
                    {card.service.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-[0.875rem] text-fg-muted">
                        <Icon name="check" size={16} className="mt-1 shrink-0 text-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="t-button mt-5 inline-flex items-center gap-1.5 text-brand">
                    ดูรายละเอียด
                    <Icon
                      name="arrowRight"
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ขั้นตอนการทำงาน ── */}
      <section className="bg-bg-subtle py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <SectionHead
            eyebrow="ขั้นตอนการทำงาน"
            title="ทำงานอย่างไร ตั้งแต่ทักมาจนใช้งานได้จริง"
            align="center"
          />

          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
            {/* เส้นเชื่อมขั้นตอน เฉพาะจอกว้าง */}
            <span
              className="absolute left-0 right-0 top-6 hidden h-px md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--border-strong) 12%, var(--border-strong) 88%, transparent)",
              }}
            />
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 110} as="li" className="relative">
                <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border-4 border-bg brand-gradient-bg text-[1.0625rem] font-bold text-white">
                  {s.n}
                </span>
                <h3 className="t-h3 mt-4">{s.title}</h3>
                <p className="t-body-sm mt-2 text-fg-muted">{s.body}</p>
                <Badge tone="outline" className="mt-3">
                  <Icon name="clock" size={12} />
                  {s.duration}
                </Badge>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ตัวอย่างหน้างาน ── */}
      <section className="bg-bg-subtle pb-16 sm:pb-20 lg:pb-24">
        <div className="shell">
          <SectionHead
            eyebrow="ผลงาน"
            title="ตัวอย่างหน้างานที่ติดตั้งแล้ว"
            sub="งานจริงจากหลายรูปแบบพื้นที่ ทั้งห้างสรรพสินค้า โรงแรม คอนโด โรงงาน และบ้านพักอาศัย"
            action={
              <ButtonLink href="/install#portfolio" variant="secondary" iconRight="arrowRight">
                ดูผลงานทั้งหมด
              </ButtonLink>
            }
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <article className="group h-full overflow-hidden rounded-card border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3">
                      <Badge tone="brand" className="bg-surface/95 backdrop-blur">
                        {portfolioTypeLabels[p.type]}
                      </Badge>
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="t-h3">{p.name}</h3>
                    <p className="t-caption mt-1 flex items-center gap-1">
                      <Icon name="mapPin" size={13} />
                      {p.location}
                    </p>
                    <p className="t-body-sm mt-3 text-fg-muted">{p.note}</p>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                      <Badge tone="outline">
                        <Icon name="plug" size={12} />
                        {p.plugs} หัวชาร์จ
                      </Badge>
                      <Badge tone="outline">{p.year + 543}</Badge>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── เกี่ยวกับเรา ── */}
      <section className="bg-bg py-16 sm:py-20">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-surface-sunken">
              <Image
                src={portfolio[0].photo}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="t-overline mb-3 text-brand">เกี่ยวกับเรา</p>
            <h2 className="t-h2">ทำงานอยู่บนโจทย์เดียวกันสองด้าน</h2>
            {aboutParagraphs.map((p) => (
              <p key={p} className="t-body mt-4 text-fg-muted">
                {p}
              </p>
            ))}
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/install" iconRight="arrowRight">
                ดูบริการติดตั้ง
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" icon="chat">
                คุยกับทีมงาน
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── บทความ ── */}
      <section className="bg-bg pb-16 sm:pb-20 lg:pb-24">
        <div className="shell">
          <SectionHead
            eyebrow="บทความ"
            title="เรื่องน่ารู้ก่อนและหลังมีรถ EV"
            action={
              <ButtonLink href="/blog" variant="secondary" iconRight="arrowRight">
                อ่านบทความทั้งหมด
              </ButtonLink>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-surface-sunken">
                    <Image
                      src={post.cover}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <Badge tone="accent">{post.category}</Badge>
                      <span className="t-caption">อ่าน {post.readMin} นาที</span>
                    </div>
                    <h3 className="t-h3 mt-3">{post.title}</h3>
                    <p className="t-body-sm mt-2 line-clamp-3 text-fg-muted">{post.excerpt}</p>
                    <p className="t-caption mt-auto pt-4">{formatThaiDate(post.date)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ปิดท้าย ── */}
      <section className="bg-bg pb-20 pt-4 sm:pb-24">
        <div className="shell">
          <Reveal>
            <div className="relative overflow-hidden rounded-panel brand-gradient-bg px-6 py-14 text-center sm:px-12">
              <div
                className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="t-h1 text-white">อยากมีเครื่องชาร์จเป็นของตัวเองไหม</h2>
                <p className="t-body-lg mt-4 text-white/85">
                  ส่งรูปตู้ไฟและบอกรุ่นรถมาให้ทีมงานดูก่อนได้เลย เราประเมินเบื้องต้นให้ฟรี
                  แล้วค่อยตัดสินใจว่าจะให้เข้าไปสำรวจหน้างานต่อหรือไม่
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <ButtonLink
                    href="/contact"
                    size="lg"
                    variant="onColor"
                    iconRight="arrowRight"
                  >
                    ขอใบเสนอราคา
                  </ButtonLink>
                  <ButtonLink href="/install" size="lg" variant="onDark">
                    ดูขั้นตอนการทำงาน
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
