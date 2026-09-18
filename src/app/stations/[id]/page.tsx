import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StationDetailBody } from "@/components/stations/StationDetail";
import { StationCard } from "@/components/stations/StationCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { stationById, stations, stationsInProvince } from "@/data/stations";
import { provinceById, regionById } from "@/data/geo";

export function generateStaticParams() {
  return stations.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const station = stationById[id];
  if (!station) return { title: "ไม่พบสถานี" };
  return {
    title: station.name,
    description: `${station.name} — ${station.address} ดูหัวชาร์จ ราคาต่อหน่วย สถานะว่าง และร้านค้าใกล้เคียง`,
  };
}

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = stationById[id];
  if (!station) notFound();

  const province = provinceById[station.provinceId];
  const nearby = stationsInProvince(station.provinceId)
    .filter((s) => s.id !== station.id)
    .slice(0, 3);

  return (
    <div className="pb-24 md:pb-16">
      <div className="shell pt-6">
        {/* เส้นทางกลับ — ให้ผู้ใช้รู้ว่ามาจากไหนและกลับไปค้นหาต่อได้ทันที */}
        <nav className="t-caption flex flex-wrap items-center gap-1.5" aria-label="เส้นทางนำทาง">
          <Link href="/stations" className="hover:text-brand">ค้นหาสถานีชาร์จ</Link>
          <Icon name="chevronRight" size={13} className="opacity-40" />
          <Link href={`/stations?province=${province.id}`} className="hover:text-brand">
            {province.name}
          </Link>
          <Icon name="chevronRight" size={13} className="opacity-40" />
          <span className="text-fg">{station.name}</span>
        </nav>
      </div>

      <article className="shell mt-5">
        <StationDetailBody station={station} variant="page" />
      </article>

      {nearby.length > 0 && (
        <section className="shell mt-8 border-t border-border pt-12">
          <SectionHead
            eyebrow={regionById[province.region].name}
            title={`สถานีอื่นใน${province.name}`}
            action={
              <ButtonLink
                href={`/stations?province=${province.id}`}
                variant="secondary"
                size="sm"
                iconRight="arrowRight"
              >
                ดูบนแผนที่
              </ButtonLink>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((s) => (
              <StationCard key={s.id} station={s} href={`/stations/${s.id}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
