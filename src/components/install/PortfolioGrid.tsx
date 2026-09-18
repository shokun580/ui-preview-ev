"use client";

import Image from "next/image";
import { useState } from "react";
import { portfolio, portfolioTypeLabels, type PortfolioType } from "@/data/install";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const types = [...new Set(portfolio.map((p) => p.type))] as PortfolioType[];

export function PortfolioGrid() {
  const [type, setType] = useState<PortfolioType | null>(null);
  const list = type ? portfolio.filter((p) => p.type === type) : portfolio;

  return (
    <>
      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setType(null)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-[0.8125rem] transition-colors",
            type === null
              ? "border-brand bg-brand-soft text-brand-soft-fg"
              : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
          )}
        >
          ทั้งหมด ({portfolio.length})
        </button>
        {types.map((tp) => (
          <button
            key={tp}
            type="button"
            onClick={() => setType(tp)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[0.8125rem] transition-colors",
              type === tp
                ? "border-brand bg-brand-soft text-brand-soft-fg"
                : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
            )}
          >
            {portfolioTypeLabels[tp]} ({portfolio.filter((p) => p.type === tp).length})
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 70}>
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
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-[0.8125rem]">
                  <div>
                    <dt className="text-fg-faint">หัวชาร์จ</dt>
                    <dd className="font-bold text-fg">{p.plugs} หัว</dd>
                  </div>
                  <div>
                    <dt className="text-fg-faint">ปีที่ติดตั้ง</dt>
                    <dd className="font-bold text-fg">{p.year + 543}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-fg-faint">อุปกรณ์</dt>
                    <dd className="font-bold text-fg">{p.kw}</dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
