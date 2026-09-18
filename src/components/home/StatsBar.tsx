import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { stationStats } from "@/data/stations";
import { portfolio } from "@/data/install";

const items: Array<{ icon: IconName; value: number; suffix: string; label: string; note: string }> = [
  { icon: "mapPin", value: stationStats.stations, suffix: " แห่ง", label: "สถานีชาร์จในระบบ", note: "อัปเดตจากทีมสำรวจ" },
  { icon: "plug", value: stationStats.plugs, suffix: " หัว", label: "หัวชาร์จรวม", note: "ทั้ง AC และ DC" },
  { icon: "map", value: stationStats.provinces, suffix: " จังหวัด", label: "ครอบคลุมทั่วไทย", note: "ครบทั้ง 6 ภาค" },
  { icon: "wrench", value: portfolio.length, suffix: " โครงการ", label: "ผลงานติดตั้ง", note: "บ้านและเชิงพาณิชย์" },
];

export function StatsBar() {
  return (
    <section className="relative border-b border-border bg-bg py-12 sm:py-14">
      {/* ไล่สีจาง ๆ ต่อจาก Hero สีเข้มด้านบน ให้รอยต่อดูตั้งใจ ไม่ใช่ตัดขวางกลางหน้า */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--rc-cyan-500) 9%, transparent), transparent)",
        }}
      />
      <div className="shell relative">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <div className="flex gap-3.5">
                <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-soft-fg">
                  <Icon name={item.icon} size={20} />
                </span>
                <div className="min-w-0">
                  <dd className="t-h1 leading-none text-fg">
                    <Counter to={item.value} />
                    <span className="t-h3 font-normal text-fg-muted">{item.suffix}</span>
                  </dd>
                  <dt className="mt-2 text-[0.9375rem] font-bold text-fg">{item.label}</dt>
                  <p className="t-caption">{item.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
