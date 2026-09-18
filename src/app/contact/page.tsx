import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ติดต่อ Recharger Energy เพื่อขอคำปรึกษาและใบเสนอราคาติดตั้งเครื่องชาร์จรถ EV สำหรับบ้านและธุรกิจ",
};

const channels: Array<{
  icon: IconName;
  label: string;
  value: string;
  href?: string;
  note: string;
}> = [
  {
    icon: "phone",
    label: "โทรศัพท์",
    value: contact.phone,
    href: contact.phoneHref,
    note: "เร็วที่สุดในเวลาทำการ",
  },
  {
    icon: "chat",
    label: "LINE",
    value: contact.lineId,
    href: contact.lineUrl,
    note: "ส่งรูปตู้ไฟมาให้ดูได้เลย",
  },
  {
    icon: "mail",
    label: "อีเมล",
    value: contact.email,
    href: `mailto:${contact.email}`,
    note: "เหมาะกับงานที่มีเอกสารแนบ",
  },
  {
    icon: "facebook",
    label: "Facebook",
    value: contact.facebook,
    href: contact.facebookUrl,
    note: "ติดตามงานติดตั้งล่าสุด",
  },
];

export default function ContactPage() {
  return (
    <div className="pb-24 md:pb-16">
      <section className="border-b border-border bg-bg-subtle py-14 sm:py-16">
        <div className="shell max-w-3xl">
          <p className="t-overline text-brand">ติดต่อเรา</p>
          <h1 className="t-h1 mt-3">คุยกับทีมงานก่อนตัดสินใจได้เลย</h1>
          <p className="t-body-lg mt-4 text-fg-muted">
            ไม่ว่าจะเป็นเรื่องติดตั้งที่บ้าน เปิดสถานีในพื้นที่ของคุณ
            หรืออยากแจ้งข้อมูลสถานีชาร์จเพิ่มเข้าระบบ ทักมาได้ทุกช่องทาง
          </p>
        </div>
      </section>

      <section className="bg-bg py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ฟอร์ม */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* ช่องทางอื่น */}
          <div className="lg:col-span-5">
            <h2 className="t-h3">ช่องทางติดต่ออื่น</h2>
            <div className="mt-5 space-y-3">
              {channels.map((c, i) => (
                <Reveal key={c.label} delay={i * 70}>
                  <a
                    href={c.href}
                    target={c.href?.startsWith("http") ? "_blank" : undefined}
                    rel={c.href?.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="group flex items-center gap-4 rounded-card border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card-hover"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-soft-fg">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="t-caption block">{c.label}</span>
                      <span className="block truncate text-[0.9375rem] font-bold text-fg">
                        {c.value}
                      </span>
                      <span className="t-caption block">{c.note}</span>
                    </span>
                    <Icon
                      name="arrowRight"
                      size={18}
                      className="shrink-0 text-fg-faint transition-transform group-hover:translate-x-1 group-hover:text-brand"
                    />
                  </a>
                </Reveal>
              ))}
            </div>

            {/* เวลาทำการ */}
            <Reveal delay={120}>
              <div className="mt-6 rounded-card border border-border bg-surface p-5">
                <h3 className="flex items-center gap-2 text-[1rem] font-bold text-fg">
                  <Icon name="clock" size={18} className="text-brand" />
                  เวลาทำการ
                </h3>
                <dl className="mt-3 space-y-2">
                  {contact.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-4 text-[0.875rem]">
                      <dt className="text-fg-muted">{h.day}</dt>
                      <dd className="font-bold text-fg">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* ที่อยู่ */}
            <Reveal delay={160}>
              <div className="mt-4 rounded-card border border-border bg-surface p-5">
                <h3 className="flex items-center gap-2 text-[1rem] font-bold text-fg">
                  <Icon name="mapPin" size={18} className="text-brand" />
                  ที่ตั้งสำนักงาน
                </h3>
                <p className="t-body-sm mt-2 text-fg-muted">{contact.address}</p>

                {/* พื้นที่สำหรับฝังแผนที่จริงในเวอร์ชันถัดไป */}
                <div className="mt-4 grid h-40 place-items-center rounded-xl border border-dashed border-border-strong bg-bg-subtle text-center">
                  <div>
                    <Icon name="map" size={26} className="mx-auto text-fg-faint" />
                    <p className="t-caption mt-2">
                      พื้นที่สำหรับฝังแผนที่
                      <br />
                      รอที่อยู่จริงจากทีมงาน
                    </p>
                  </div>
                </div>
                <Badge tone="outline" className="mt-3">
                  <Icon name="info" size={12} />
                  ข้อมูลติดต่อทั้งหมดเป็นค่าตัวอย่าง
                </Badge>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
