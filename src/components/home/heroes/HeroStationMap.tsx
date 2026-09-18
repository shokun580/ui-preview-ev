"use client";

import { provinceShapes } from "@/data/geo";
import { project } from "@/data/thailand-geo";
import { stations } from "@/data/stations";

/**
 * แผนที่ประกอบ Hero — ไม่ใช่ตัวแผนที่ที่กดใช้งานได้
 * วาดขอบเขตจังหวัดจริงจาง ๆ แล้ววางหมุดสถานีทั้ง 54 แห่งพร้อมจังหวะกะพริบเหลื่อมกัน
 * เพื่อสื่อว่าเว็บนี้มีข้อมูลสถานีจริงอยู่ในมือ โดยไม่ต้องพูดออกมาเป็นคำ
 *
 * ค่าเริ่มต้นใช้สีจาก token ของธีม จึงอ่านออกทั้งโหมดสว่างและมืด
 * ส่วน variant "onDark" ไว้ใช้กับ Hero ที่บังคับพื้นเข้มไม่ว่าธีมจะเป็นแบบไหน
 */
export function HeroStationMap({
  variant = "auto",
}: {
  variant?: "auto" | "onDark";
}) {
  const onDark = variant === "onDark";
  const land = onDark ? "rgba(255,255,255,0.09)" : "var(--map-land)";
  const edge = onDark ? "rgba(255,255,255,0.16)" : "var(--map-land-edge)";
  const pin = onDark ? "var(--rc-mint-300)" : "var(--brand)";
  const halo = onDark ? "var(--rc-mint-400)" : "var(--accent)";

  return (
    <svg
      viewBox="-8 -8 469 846"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g>
        {provinceShapes.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill={land}
            stroke={edge}
            strokeWidth={0.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <g>
        {stations.map((s, i) => {
          const [x, y] = project(s.lng, s.lat);
          return (
            <g key={s.id}>
              <circle
                cx={x}
                cy={y}
                r={5}
                fill={halo}
                opacity={0.5}
                style={{
                  transformOrigin: `${x}px ${y}px`,
                  animation: `rc-pulse-ring 3.2s ease-out ${(i % 12) * 0.26}s infinite`,
                }}
              />
              <circle cx={x} cy={y} r={3.4} fill={pin} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
