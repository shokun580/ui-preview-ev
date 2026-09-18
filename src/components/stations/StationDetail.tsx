"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  amenityLabels,
  connectorInfo,
  maxKw,
  networks,
  speedLabels,
  speedTier,
  totalPlugs,
  type NearbyPlace,
  type Station,
} from "@/data/stations";
import { appById } from "@/data/apps";
import { provinceById } from "@/data/geo";
import { AppLogo } from "@/components/ui/AppLogo";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { SurveyScore } from "./SurveyScore";
import { cn, formatKm } from "@/lib/utils";

const nearbyIcon: Record<NearbyPlace["category"], IconName> = {
  cafe: "coffee",
  food: "food",
  shop: "shop",
  restroom: "restroom",
  mall: "mall",
};

const amenityIcon: Record<string, IconName> = {
  restroom: "restroom",
  cafe: "coffee",
  restaurant: "food",
  mall: "mall",
  convenience: "shop",
  wifi: "wifi",
  freeParking: "parking",
};

function mapsUrl(s: Station) {
  return `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
}

type Tab = "info" | "nearby";

export function StationDetailBody({
  station,
  distance,
  variant = "panel",
}: {
  station: Station;
  distance?: number;
  variant?: "panel" | "page";
}) {
  const [tab, setTab] = useState<Tab>("info");
  const net = networks[station.network];
  const app = appById[net.appId];
  const total = totalPlugs(station);
  const province = provinceById[station.provinceId];

  /* ตั้งใจไม่มีแท็บรีวิว — รีวิวทั้งหมดเขียนโดยทีมงานหลังบ้านเพียงแหล่งเดียว
     การโชว์เป็น "คะแนนจากผู้ใช้" จึงทำให้เข้าใจผิดว่าเป็นความเห็นจากคนหลายคน */
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "info", label: "ข้อมูลสถานี" },
    { id: "nearby", label: "รอบ ๆ สถานี" },
  ];

  return (
    <div>
      {/* ── หัวเรื่อง ── */}
      <div className={cn(variant === "page" && "lg:flex lg:gap-8")}>
        <div
          className={cn(
            "relative overflow-hidden bg-surface-sunken",
            variant === "panel"
              ? "h-44 w-full"
              : "h-56 w-full rounded-panel sm:h-72 lg:h-80 lg:w-1/2 lg:shrink-0",
          )}
        >
          <Image
            src={station.photo}
            alt={station.name}
            fill
            sizes={variant === "page" ? "(max-width: 1024px) 100vw, 50vw" : "420px"}
            className="object-cover"
            priority={variant === "page"}
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-bg/92 py-1.5 pl-1.5 pr-3.5 shadow-md backdrop-blur">
            <AppLogo id={net.appId} name={net.name} size={24} />
            <span className="text-[0.8125rem] font-bold text-fg">{net.name}</span>
          </span>
        </div>

        <div className={cn(variant === "panel" ? "px-4 pt-4" : "pt-6 lg:flex-1 lg:pt-0")}>
          <h1 className={cn(variant === "panel" ? "t-h3" : "t-h1")}>{station.name}</h1>

          {distance !== undefined && (
            <Badge tone="brand" className="mt-2">
              <Icon name="navigation" size={12} />
              ห่าง {formatKm(distance)}
            </Badge>
          )}

          <p className="t-body-sm mt-3 flex gap-2 text-fg-muted">
            <Icon name="mapPin" size={17} className="mt-0.5 shrink-0 text-brand" />
            <span>{station.address}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="neutral">
              <Icon name="plug" size={12} />
              {total} หัวชาร์จ
            </Badge>
            <Badge tone="brand">
              <Icon name="bolt" size={12} />
              {speedLabels[speedTier(station)]} สูงสุด {maxKw(station)} kW
            </Badge>
            <Badge tone={station.open24 ? "accent" : "neutral"}>
              <Icon name="clock" size={12} />
              {station.hours}
            </Badge>
          </div>

          <SurveyScore score={station.rating} variant="full" className="mt-4" />

          {/* สิ่งอำนวยความสะดวกอยู่เหนือปุ่ม เพราะเป็นข้อมูลที่ใช้ตัดสินใจ
              ว่าจะไปที่นี่ไหม ควรเห็นก่อนกดนำทาง ไม่ใช่ต้องเลื่อนลงไปหา */}
          {station.amenities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {station.amenities.map((a) => (
                <li key={a}>
                  <Badge tone="neutral" className="py-1.5">
                    <Icon name={amenityIcon[a] ?? "check"} size={14} />
                    {amenityLabels[a]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          <div className={cn("mt-5 flex flex-wrap gap-2", variant === "panel" && "pb-4")}>
            <ButtonLink
              href={mapsUrl(station)}
              target="_blank"
              rel="noreferrer noopener"
              icon="navigation"
              size={variant === "page" ? "lg" : "md"}
              className="flex-1"
            >
              นำทาง
            </ButtonLink>
            {variant === "panel" && (
              <ButtonLink
                href={`/stations/${station.id}`}
                variant="secondary"
                iconRight="arrowRight"
                className="flex-1"
              >
                รายละเอียดเต็ม
              </ButtonLink>
            )}
          </div>
        </div>
      </div>

      {/* ── แท็บ ── */}
      <div
        className={cn(
          "sticky top-0 z-10 flex gap-1 border-b border-border bg-bg/92 backdrop-blur",
          variant === "panel" ? "px-4" : "mt-10",
        )}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-3 py-3 text-[0.875rem] font-bold transition-colors",
              tab === t.id ? "text-brand" : "text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>

      <div className={cn(variant === "panel" ? "px-4 py-5" : "py-8")}>
        {tab === "info" && (
          <div
            className={cn("space-y-6", variant === "page" && "lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0")}
          >
            {/* หัวชาร์จ */}
            <section>
              <h2 className="t-overline mb-3 text-fg-muted">หัวชาร์จที่มี</h2>
              <ul className="space-y-2">
                {station.connectors.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-soft-fg">
                      <Icon name="plug" size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.9375rem] font-bold text-fg">
                        {c.type} · {c.kw} kW
                      </p>
                      <p className="t-caption">{connectorInfo[c.type].note}</p>
                    </div>
                    <Badge tone="outline">{c.total} หัว</Badge>
                  </li>
                ))}
              </ul>
            </section>

            <div className="space-y-6">
              {/* ราคา */}
              <section>
                <h2 className="t-overline mb-3 text-fg-muted">ค่าบริการ</h2>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="t-h2 text-brand">฿{station.pricePerKwh.toFixed(2)}</span>
                    <span className="t-body-sm text-fg-muted">ต่อหน่วย (kWh)</span>
                  </div>
                  <p className="t-body-sm mt-2 flex gap-2 text-fg-muted">
                    <Icon name="parking" size={16} className="mt-0.5 shrink-0" />
                    {station.parkingNote}
                  </p>
                  <p className="t-caption mt-3 border-t border-border pt-3">
                    ชาร์จ 20% → 80% สำหรับแบต 60 kWh ประมาณ{" "}
                    <strong className="text-fg">
                      ฿{(36 * station.pricePerKwh).toFixed(0)}
                    </strong>{" "}
                    ใช้เวลาราว {Math.round((36 / maxKw(station)) * 60 * 1.25)} นาที
                  </p>
                </div>
              </section>

              {/* แอปที่ต้องใช้ */}
              {app && (
                <section>
                  <h2 className="t-overline mb-3 text-fg-muted">ต้องใช้แอปไหน</h2>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                    <AppLogo id={app.id} name={app.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.9375rem] font-bold text-fg">{app.name}</p>
                      <p className="t-caption truncate">{app.operator}</p>
                    </div>
                    <Link
                      href={`/guide#app-${app.id}`}
                      className="t-button shrink-0 text-brand hover:underline"
                    >
                      ดูข้อมูล
                    </Link>
                  </div>
                </section>
              )}

            </div>
          </div>
        )}

        {tab === "nearby" && (
          <div>
            <p className="t-body-sm mb-4 text-fg-muted">
              ชาร์จ DC หนึ่งรอบใช้เวลาราว 30–40 นาที นี่คือที่ที่เดินไปนั่งรอได้ใน{" "}
              {province?.name}
            </p>
            <ul className="space-y-2">
              {station.nearby.map((n, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg">
                    <Icon name={nearbyIcon[n.category]} size={19} />
                  </span>
                  <p className="flex-1 text-[0.9375rem] font-bold text-fg">{n.name}</p>
                  <Badge tone="outline">เดิน {n.walkMin} นาที</Badge>
                </li>
              ))}
            </ul>
            <p className="t-caption mt-4">
              ข้อมูลร้านค้าใกล้เคียงเป็นข้อมูลตัวอย่างสำหรับต้นแบบนี้
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
