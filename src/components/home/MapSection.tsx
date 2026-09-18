"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThailandMap } from "@/components/map/ThailandMap";
import { StationCard } from "@/components/stations/StationCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { ButtonLink } from "@/components/ui/Button";
import { regions, regionById, type RegionId } from "@/data/geo";
import { stations, stationsInRegion } from "@/data/stations";
import { cn } from "@/lib/utils";

/**
 * แผนที่ย่อบนหน้าแรก — เลือกภาคเพื่อดูสถานีเด่นของภาคนั้น
 * กดสถานีหรือกดจังหวัดแล้วจะพาไปหน้าค้นหาเต็มรูปแบบ
 */
export function MapSection() {
  const router = useRouter();
  const [region, setRegion] = useState<RegionId | null>(null);

  const list = (region ? stationsInRegion(region) : stations)
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section className="bg-bg-subtle py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          eyebrow="ค้นหาสถานีชาร์จ"
          title="สถานีชาร์จทั่วประเทศไทย"
          sub="กดเลือกภาคบนแผนที่เพื่อดูว่าแถวนั้นมีสถานีอะไรบ้าง หรือเข้าหน้าค้นหาเพื่อกรองตามหัวชาร์จ ความเร็ว และผู้ให้บริการ"
          action={
            <ButtonLink href="/stations" variant="secondary" iconRight="arrowRight">
              เปิดแผนที่เต็มจอ
            </ButtonLink>
          }
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="rounded-panel border border-border bg-surface p-3 sm:p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRegion(null)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                    region === null
                      ? "border-brand bg-brand-soft text-brand-soft-fg"
                      : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
                  )}
                >
                  ทั้งประเทศ
                </button>
                {regions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegion(r.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                      region === r.id
                        ? "border-brand bg-brand-soft text-brand-soft-fg"
                        : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
                    )}
                  >
                    {r.short}
                  </button>
                ))}
              </div>

              <ThailandMap
                wheelMode="modifier"
                className="h-[26rem] w-full sm:h-[32rem]"
                stations={stations}
                selectedRegion={region}
                selectedProvince={null}
                onSelectRegion={setRegion}
                onSelectProvince={(p) => p && router.push(`/stations?province=${p}`)}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="t-overline mb-3 text-fg-muted">
              {region ? `สถานีแนะนำใน${regionById[region].name}` : "สถานีที่คะแนนสูงที่สุด"}
            </p>
            <div className="space-y-2.5">
              {list.map((s) => (
                <StationCard key={s.id} station={s} href={`/stations/${s.id}`} />
              ))}
            </div>
            <ButtonLink
              href={region ? "/stations" : "/stations"}
              variant="ghost"
              className="mt-3 w-full"
              iconRight="arrowRight"
            >
              ดูสถานีทั้งหมด
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
