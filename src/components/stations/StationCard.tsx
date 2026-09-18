"use client";

import Image from "next/image";
import Link from "next/link";
import {
  amenityLabels,
  connectorTypes,
  maxKw,
  networks,
  speedLabels,
  speedTier,
  type Station,
} from "@/data/stations";
import { provinceById } from "@/data/geo";
import { AppLogo } from "@/components/ui/AppLogo";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SurveyScore } from "./SurveyScore";
import { cn, formatKm } from "@/lib/utils";

const amenityIcon: Record<string, IconName> = {
  restroom: "restroom",
  cafe: "coffee",
  restaurant: "food",
  mall: "mall",
  convenience: "shop",
  wifi: "wifi",
  freeParking: "parking",
};

/**
 * การ์ดผลการค้นหา — ใช้ทั้งในรายการหน้าค้นหา (กดแล้วเปิดแผงรายละเอียด)
 * และในลิสต์แนะนำ (กดแล้วไปหน้าเต็ม)
 * จึงเลือกเรนเดอร์เป็น button หรือ link ตามที่ส่งเข้ามา แทนการซ้อน element ที่กดได้ไว้ด้วยกัน
 *
 * ตั้งใจไม่โชว์จำนวนหัวว่างบนการ์ด เพราะเป็นตัวเลขที่เปลี่ยนตลอดเวลา
 * เห็นตอนเลือกดูรายละเอียดก็ทันการณ์กว่า ส่วนบนการ์ดให้พื้นที่กับ
 * "รอบ ๆ สถานีมีอะไรบ้าง" ซึ่งเป็นสิ่งที่ใช้ตัดสินใจว่าจะแวะที่ไหนมากกว่า
 */
export function StationCard({
  station,
  distance,
  active,
  onClick,
  href,
}: {
  station: Station;
  distance?: number;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const net = networks[station.network];
  const province = provinceById[station.provinceId];

  const className = cn(
    "group block w-full rounded-card border bg-surface p-3 text-left transition-all duration-200",
    active
      ? "border-brand shadow-[var(--shadow-brand)]"
      : "border-border hover:border-border-strong hover:shadow-card-hover",
  );

  const inner = (
    <>
      <div className="flex gap-3">
        <div className="relative h-[4.75rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
          <Image
            src={station.photo}
            alt=""
            fill
            sizes="88px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <AppLogo
            id={net.appId}
            name={net.name}
            size={22}
            className="absolute left-1.5 top-1.5 shadow-sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-bold leading-snug text-fg">
            {station.name}
          </p>

          <p className="t-caption mt-0.5 flex items-center gap-1 truncate">
            <Icon name="mapPin" size={13} className="shrink-0" />
            {province?.name}
            {distance !== undefined && (
              <>
                <span className="opacity-40">·</span>
                <span className="font-bold text-brand">{formatKm(distance)}</span>
              </>
            )}
          </p>

          {/* สิ่งอำนวยความสะดวกรอบ ๆ — ตัวช่วยตัดสินใจว่าจะแวะที่ไหนระหว่างรอชาร์จ */}
          {station.amenities.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {station.amenities.slice(0, 4).map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-1 text-[0.75rem] text-fg-muted"
                >
                  <Icon name={amenityIcon[a] ?? "check"} size={13} className="text-accent" />
                  {amenityLabels[a]}
                </li>
              ))}
              {station.amenities.length > 4 && (
                <li className="text-[0.75rem] text-fg-faint">
                  +{station.amenities.length - 4}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge tone="brand">
          {speedLabels[speedTier(station)]} {maxKw(station)} kW
        </Badge>
        {connectorTypes(station).slice(0, 2).map((c) => (
          <Badge key={c} tone="outline">{c}</Badge>
        ))}
        <SurveyScore score={station.rating} />
        <span className="t-caption ml-auto font-bold text-fg">
          ฿{station.pricePerKwh.toFixed(2)}/หน่วย
        </span>
      </div>
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}
