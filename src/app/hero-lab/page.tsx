import type { Metadata } from "next";
import {
  HeroEditorial,
  HeroLiveMap,
  HeroModern,
  HeroPhoto,
  HeroTwoDoor,
} from "@/components/home/heroes";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "เปรียบเทียบแนวทาง Hero",
  description: "หน้าเปรียบเทียบแนวทางการออกแบบ Hero ทั้ง 5 แบบ สำหรับเลือกก่อนนำไปใช้จริง",
  robots: { index: false, follow: false },
};

const variants = [
  {
    id: "modern",
    n: "05",
    title: "Modern Effects",
    tone: "มืด · มีลูกเล่น",
    body: "ลายตารางไล่จาง หัวเรื่องค่อย ๆ ชัดทีละวรรค มีวรรคที่ไล่สีเคลื่อนช้า ๆ ปุ่มหลักมีแสงกวาด การ์ดตัวเลขใบแรกมีเส้นแสงวิ่งรอบขอบ ปิดท้ายด้วยแถบเครือข่ายเลื่อนต่อเนื่อง",
    good: "ดูทันสมัยที่สุด และทุกเอฟเฟกต์ยังผูกกับเนื้อหาจริง ไม่ใช่ของประดับ",
    watch: "มีของเยอะที่สุด ถ้าอยากเรียบกว่านี้ตัดเอฟเฟกต์ออกทีละอย่างได้",
    Component: HeroModern,
  },
  {
    id: "livemap",
    n: "02",
    title: "Live Station Map",
    tone: "มืด · ข้อมูลนำ",
    body: "แบ่งครึ่ง ข้อความซ้าย แผนที่จริงขวา หมุดสถานีทั้ง 54 แห่งกะพริบเหลื่อมกัน มีทางลัดไปจังหวัดยอดนิยม",
    good: "สื่อว่า “เรามีข้อมูลสถานีจริง” ได้ทันทีโดยไม่ต้องเขียนบอก และไม่ต้องใช้ภาพสต๊อก",
    watch: "ถ้าในอนาคตข้อมูลสถานียังน้อย แผนที่จะดูโล่ง",
    Component: HeroLiveMap,
  },
  {
    id: "twodoor",
    n: "03",
    title: "Two Doors",
    tone: "มืด · แยกกลุ่มผู้ใช้",
    body: "แบ่งหน้าจอแรกเป็นสองประตูใหญ่ ให้ผู้ใช้เลือกเองว่ามาหาที่ชาร์จ หรือมาหาคนติดตั้ง",
    good: "ตรงกับที่ตอบไว้ว่าเป้าหมายสองด้านสำคัญเท่ากัน ลดการเดาใจผู้ใช้ และวัดผลง่ายว่าคนกดประตูไหนมากกว่า",
    watch: "พื้นที่บอกว่า Recharger คือใครจะน้อยลง เพราะต้องแบ่งที่ให้สองการ์ด",
    Component: HeroTwoDoor,
  },
  {
    id: "editorial",
    n: "04",
    title: "Light Editorial",
    tone: "สว่าง · พรีเมียม",
    body: "พื้นสว่างทั้งหมด ตัวอักษรใหญ่ มีวรรคหนึ่งไล่สีตามโลโก้ ด้านขวาเป็นคอลลาจภาพสามใบ",
    good: "สะอาดและพรีเมียมที่สุด เข้ากับ mood ที่เลือกไว้ว่าสว่างเป็นหลัก",
    watch: "พึ่งคุณภาพรูปมาก ถ้ารูปไม่สวยจะดูธรรมดาทันที",
    Component: HeroEditorial,
  },
  {
    id: "photo",
    n: "01",
    title: "Photo Background",
    tone: "มืด · แบบที่ใช้อยู่",
    body: "ภาพถ่ายพื้นหลังโทนมืด ข้อความชิดซ้าย การ์ดตัวเลขลอยขวา",
    good: "ปลอดภัย คุ้นตา ทำเร็ว",
    watch: "เป็นรูปแบบที่เจอได้ทั่วไป ยังไม่มีอะไรบอกว่านี่คือ Recharger",
    Component: HeroPhoto,
  },
];

export default function HeroLabPage() {
  return (
    <div className="pb-24 md:pb-16">
      <section className="border-b border-border bg-bg-subtle py-10 sm:py-12">
        <div className="shell max-w-3xl">
          <Badge tone="brand">หน้าสำหรับเลือกแบบ</Badge>
          <h1 className="t-h1 mt-3">แนวทาง Hero 5 แบบ</h1>
          <p className="t-body mt-3 text-fg-muted">
            เลื่อนดูได้ทั้งหน้า ทุกแบบใช้ฟอนต์ สี และเนื้อหาชุดเดียวกัน
            ต่างกันที่วิธีจัดวางและระดับลูกเล่น เลือกได้เลยว่าจะเอาแบบไหน
            แล้วผมจะเอาไปใช้เป็น Hero จริงของหน้าแรก
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {variants.map((v) => (
              <a
                key={v.id}
                href={`#hero-${v.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[0.8125rem] text-fg-muted transition-colors hover:border-brand hover:text-brand"
              >
                <span className="t-num text-fg-faint">{v.n}</span>
                {v.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {variants.map((v) => (
        <section key={v.id} id={`hero-${v.id}`} className="scroll-mt-20">
          <div className="border-y border-border bg-bg py-7">
            <div className="shell">
              <div className="flex flex-wrap items-center gap-3">
                <span className="t-h2 t-num font-bold text-fg-faint">{v.n}</span>
                <h2 className="t-h3">{v.title}</h2>
                <Badge tone="outline">{v.tone}</Badge>
              </div>
              <p className="t-body-sm mt-2 max-w-3xl text-fg-muted">{v.body}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="flex gap-2 rounded-xl bg-ok-soft px-3.5 py-2.5 text-[0.8125rem] text-ok">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0" />
                  <span>{v.good}</span>
                </p>
                <p className="flex gap-2 rounded-xl bg-warn-soft px-3.5 py-2.5 text-[0.8125rem] text-warn">
                  <Icon name="info" size={16} className="mt-0.5 shrink-0" />
                  <span>{v.watch}</span>
                </p>
              </div>
            </div>
          </div>
          <v.Component />
        </section>
      ))}

      <section className="bg-bg-subtle py-12">
        <div className="shell max-w-3xl text-center">
          <h2 className="t-h3">ชอบแบบไหน</h2>
          <p className="t-body-sm mt-2 text-fg-muted">
            บอกเลขแบบมาได้เลย หรือจะผสมก็ได้ เช่น เอาโครงของ 05
            แต่ใช้พื้นสว่างแบบ 04 หรือเอา 03 มาวางไว้ใต้ Hero แทนที่จะเป็นตัว Hero เอง
          </p>
        </div>
      </section>
    </div>
  );
}
