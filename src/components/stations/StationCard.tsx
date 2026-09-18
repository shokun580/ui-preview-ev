"use client";

import Image from "next/image";
import Link from "next/link";
import {
  amenityLabels,
  connectorTypes,
  maxKw,
  networks,
  type Station,
} from "@/data/stations";
import { provinceById } from "@/data/geo";
import { AppLogo } from "@/components/ui/AppLogo";
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

const MAX_AMENITY_ICONS = 4;
const MAX_CONNECTORS = 2;

/**
 * การ์ดผลการค้นหา — ใช้ทั้งในรายการหน้าค้นหา (กดแล้วเปิดแผงรายละเอียด)
 * และในลิสต์แนะนำ (กดแล้วไปหน้าเต็ม)
 * จึงเลือกเรนเดอร์เป็น button หรือ link ตามที่ส่งเข้ามา แทนการซ้อน element ที่กดได้ไว้ด้วยกัน
 *
 * โครงเป็น 4 บรรทัดข้างรูป บรรทัดละเรื่อง ไล่ตามลำดับที่คนใช้ตัดสินใจจริง:
 *   ชื่อ+คะแนน → ที่ไหน+ไกลแค่ไหน → แรงแค่ไหน+หัวอะไร → รอบ ๆ มีอะไร+ราคา
 *
 * ทุกบรรทัดตัดด้วย truncate ไม่ให้ตกบรรทัด เพราะความสูงการ์ดที่ไม่เท่ากัน
 * ทำให้รายการยาว ๆ อ่านยากกว่าการเสียปลายข้อความไปนิดหน่อย
 *
 * ตั้งใจไม่ใช้ Badge กับความเร็วและหัวชาร์จแล้ว — ก่อนหน้านี้การ์ดหนึ่งใบมีชิป
 * ถึง 3 แถว (สิ่งอำนวยความสะดวก + ความเร็ว + หัวชาร์จ + คะแนน) ตัวกรอบชิปเอง
 * กลายเป็นสิ่งที่ดึงสายตามากกว่าข้อมูลข้างใน เหลือไว้ชิปเดียวคือคะแนน
 *
 * สิ่งอำนวยความสะดวกเหลือแต่ไอคอน (ชื่อเต็มอยู่ใน title) เพราะบนการ์ดต้องการแค่
 * "มีอะไรบ้าง" แบบกวาดตาผ่าน ส่วนชื่อเต็มไปอ่านในแผงรายละเอียดได้
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
  const shown = station.amenities.slice(0, MAX_AMENITY_ICONS);
  const rest = station.amenities.length - shown.length;
  const plugs = connectorTypes(station);
  const morePlugs = plugs.length - MAX_CONNECTORS;

  const className = cn(
    "group block w-full rounded-card border bg-surface p-3 text-left transition-all duration-200",
    active
      ? "border-brand shadow-[var(--shadow-brand)]"
      : "border-border hover:border-border-strong hover:shadow-card-hover",
  );

  const inner = (
    <div className="flex gap-3">
      {/* จอช่วง md แผงรายการแคบสุด (~272px) รูปเล็กลงเพื่อคืนที่ให้ข้อความ
            ไม่งั้นบรรทัดหัวชาร์จจะโดนตัดกลางคำว่า "Type 2" */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken lg:h-20 lg:w-20">
        <Image
          src={station.photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 80px, 64px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <AppLogo
          id={net.appId}
          name={net.name}
          size={20}
          className="absolute left-1 top-1 shadow-sm"
        />
      </div>

      <div className="min-w-0 flex-1">
        {/* ชื่อกินเต็มบรรทัด ไม่แบ่งที่ให้อย่างอื่น เพราะในแผงกว้าง 20rem
            พอมีอะไรมาแย่งที่ ชื่อจะโดนตัดตั้งแต่คำที่สองจนแยกสถานีไม่ออก */}
        <p className="truncate text-[0.9375rem] font-bold leading-snug text-fg">
          {station.name}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <p className="t-caption flex min-w-0 flex-1 items-center gap-1 truncate">
            <Icon name="mapPin" size={13} className="shrink-0" />
            {province?.name}
            {distance !== undefined && (
              <>
                <span className="opacity-40">·</span>
                <span className="font-bold text-brand">{formatKm(distance)}</span>
              </>
            )}
          </p>
          <SurveyScore score={station.rating} className="shrink-0" />
        </div>

        <p className="t-caption mt-1 flex items-center gap-1.5 truncate">
          <Icon name="bolt" size={13} className="shrink-0 text-brand" />
          <span className="font-bold text-fg">{maxKw(station)} kW</span>
          <span className="opacity-40">·</span>
          <span className="truncate">
            {plugs.slice(0, MAX_CONNECTORS).join(" · ")}
            {morePlugs > 0 && ` +${morePlugs}`}
          </span>
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden pr-1">
            {shown.map((a) => (
              <li key={a} title={amenityLabels[a]} className="shrink-0">
                <Icon
                  name={amenityIcon[a] ?? "check"}
                  size={15}
                  className="text-fg-faint"
                />
              </li>
            ))}
            {rest > 0 && (
              <li className="shrink-0 text-[0.75rem] text-fg-faint">+{rest}</li>
            )}
          </ul>
          <span className="t-caption shrink-0 font-bold text-fg">
            ฿{station.pricePerKwh.toFixed(2)}/หน่วย
          </span>
        </div>
      </div>
    </div>
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
