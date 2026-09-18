import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { contact, site } from "@/data/site";

const columns = [
  {
    title: "ค้นหาและเรียนรู้",
    links: [
      { href: "/stations", label: "ค้นหาสถานีชาร์จ" },
      { href: "/guide", label: "รู้จักวิธีใช้งาน" },
      { href: "/guide#quiz", label: "แบบทดสอบหาแอปที่ใช่" },
      { href: "/blog", label: "บทความเรื่อง EV" },
    ],
  },
  {
    title: "บริการติดตั้ง",
    links: [
      { href: "/install?seg=home", label: "ติดตั้งที่บ้าน" },
      { href: "/install?seg=business", label: "ติดตั้งเชิงพาณิชย์" },
      { href: "/install#process", label: "ขั้นตอนการทำงาน" },
      { href: "/install#portfolio", label: "ตัวอย่างหน้างาน" },
    ],
  },
];

const socialClass =
  "grid h-10 w-10 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:border-brand hover:text-brand";

/**
 * Footer ใช้ token ของธีมทั้งหมด จึงสว่างในโหมดสว่างและมืดในโหมดมืด
 *
 * โลโก้ตรงนี้ใช้คอมโพเนนต์ Logo ที่ประกอบขึ้นเอง ไม่ใช้ไฟล์ .webp ต้นฉบับ
 * เพราะคำว่า RECHARGER ในไฟล์เป็นตัวอักษรกลวงสีขาว ซึ่งจะหายไปบนพื้นสว่าง
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle pb-14 pt-16 text-fg-muted">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Logo size={42} id="ftr" />
            <p className="t-body-sm mt-5 max-w-sm">{site.description}</p>
            <div className="mt-6 flex gap-2">
              <a
                href={contact.lineUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`LINE ${contact.lineId}`}
                className={socialClass}
              >
                <Icon name="chat" size={18} />
              </a>
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className={socialClass}
              >
                <Icon name="facebook" size={18} />
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label={contact.email}
                className={socialClass}
              >
                <Icon name="mail" size={18} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="t-overline mb-4 text-fg">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.9375rem] transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <h3 className="t-overline mb-4 text-fg">ติดต่อเรา</h3>
            <ul className="space-y-3 text-[0.9375rem]">
              <li className="flex gap-2.5">
                <Icon name="phone" size={17} className="mt-1 shrink-0 text-brand" />
                <a href={contact.phoneHref} className="hover:text-brand">
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icon name="mail" size={17} className="mt-1 shrink-0 text-brand" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-brand">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icon name="mapPin" size={17} className="mt-1 shrink-0 text-brand" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Icon name="clock" size={17} className="mt-1 shrink-0 text-brand" />
                <span>
                  {contact.hours[0].day} {contact.hours[0].time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="t-caption mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. สงวนลิขสิทธิ์
          </p>
          <p>ออกแบบและพัฒนาเป็นต้นแบบเพื่อใช้ทบทวนโครงสร้างและทิศทางงานออกแบบ</p>
        </div>
      </div>
    </footer>
  );
}
