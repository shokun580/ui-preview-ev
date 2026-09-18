"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MAP_H,
  MAP_W,
  project,
  provinceById,
  regionBBox,
  regions,
  shapesInRegion,
  type RegionId,
} from "@/data/geo";
import type { Station } from "@/data/stations";
import { cn } from "@/lib/utils";
import { useMapGestures, type ViewBox } from "./useMapGestures";

const FULL: ViewBox = [-10, -10, MAP_W + 20, MAP_H + 20];

/** ระดับความหนาแน่น 0–4 → สีระบายจังหวัด (ยิ่งเข้ม = สถานียิ่งเยอะ) */
const heatFill = [
  "var(--map-land)",
  "color-mix(in srgb, var(--rc-mint-400) 38%, var(--map-land))",
  "color-mix(in srgb, var(--rc-mint-400) 64%, var(--map-land))",
  "color-mix(in srgb, var(--rc-cyan-500) 62%, var(--map-land))",
  "color-mix(in srgb, var(--rc-cyan-500) 92%, var(--map-land))",
];

function heatLevel(count: number, max: number) {
  if (count === 0 || max === 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4)));
}

/** จุดวางฟองตัวเลขของภาค — เฉลี่ยจุดกึ่งกลางของจังหวัดในภาคนั้น */
const regionAnchor = Object.fromEntries(
  regions.map((r) => {
    const members = shapesInRegion(r.id);
    const x = members.reduce((n, p) => n + p.label[0], 0) / members.length;
    const y = members.reduce((n, p) => n + p.label[1], 0) / members.length;
    return [r.id, [x, y] as [number, number]];
  }),
) as Record<RegionId, [number, number]>;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function ThailandMap({
  stations,
  selectedRegion,
  selectedProvince,
  selectedStationId,
  onSelectRegion,
  onSelectProvince,
  onSelectStation,
  className,
  wheelMode = "always",
}: {
  stations: Station[];
  selectedRegion: RegionId | null;
  selectedProvince: string | null;
  selectedStationId?: string | null;
  onSelectRegion: (r: RegionId | null) => void;
  onSelectProvince: (p: string | null) => void;
  onSelectStation?: (id: string) => void;
  className?: string;
  /** always = หมุนล้อซูมได้เลย (ใช้กับหน้าค้นหาที่แผนที่เต็มจอ)
   *  modifier = ต้องกด Ctrl/Cmd ค้าง (ใช้กับแผนที่ที่ฝังอยู่ในหน้าที่เลื่อนได้) */
  wheelMode?: "always" | "modifier" | "off";
}) {
  const [viewBox, setViewBox] = useState<ViewBox>(FULL);
  const [box, setBox] = useState({ w: 640, h: 820 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [wheelHint, setWheelHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // เก็บ viewBox ล่าสุดไว้ใน ref ด้วย เพราะตัวจัดการท่าทางต้องอ่านค่าสดระหว่างลาก
  // ถ้าอ่านจาก state จะได้ค่าค้างของเฟรมก่อนหน้า จึงอัปเดตทั้งสองที่พร้อมกันเสมอ
  const viewBoxRef = useRef<ViewBox>(FULL);
  const applyViewBox = useCallback((v: ViewBox) => {
    viewBoxRef.current = v;
    setViewBox(v);
  }, []);

  const { handlers, zoomCenter, guardClick } = useMapGestures({
    svgRef,
    viewBoxRef,
    setViewBox: applyViewBox,
    world: [-20, -20, MAP_W + 20, MAP_H + 20],
    minWidth: 26,
    maxWidth: FULL[2] * 1.15,
    wheelMode,
    onWheelBlocked: () => {
      setWheelHint(true);
      if (hintTimer.current) clearTimeout(hintTimer.current);
      hintTimer.current = setTimeout(() => setWheelHint(false), 1400);
    },
  });

  /* ── วัดขนาดกล่องจริง เพื่อให้ตัวอักษรและหมุดคงขนาดบนจอเสมอ ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const counts = useMemo(() => {
    const byRegion = {} as Record<RegionId, number>;
    const byProvince: Record<string, number> = {};
    for (const r of regions) byRegion[r.id] = 0;
    for (const s of stations) {
      byRegion[s.region] = (byRegion[s.region] ?? 0) + 1;
      byProvince[s.provinceId] = (byProvince[s.provinceId] ?? 0) + 1;
    }
    return {
      byRegion,
      byProvince,
      maxRegion: Math.max(1, ...Object.values(byRegion)),
      maxProvince: Math.max(1, ...Object.values(byProvince)),
    };
  }, [stations]);

  /* ── กรอบมุมมองเป้าหมาย ── */
  const target = useMemo<ViewBox>(() => {
    const region = selectedProvince
      ? provinceById[selectedProvince]?.region ?? selectedRegion
      : selectedRegion;
    if (region) {
      const b = regionBBox(region);
      const pad = Math.max(18, Math.min(b.width, b.height) * 0.12);
      return [b.minX - pad, b.minY - pad, b.width + pad * 2, b.height + pad * 2];
    }
    return FULL;
  }, [selectedRegion, selectedProvince]);

  useEffect(() => {
    const from = viewBox;
    const to = target;
    if (from.every((v, i) => Math.abs(v - to[i]) < 0.5)) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const id = requestAnimationFrame(() => applyViewBox(to));
      return () => cancelAnimationFrame(id);
    }

    const start = performance.now();
    const dur = 620;
    cancelAnimationFrame(animRef.current);
    const tick = (now: number) => {
      const p = easeOut(Math.min(1, (now - start) / dur));
      applyViewBox([
        from[0] + (to[0] - from[0]) * p,
        from[1] + (to[1] - from[1]) * p,
        from[2] + (to[2] - from[2]) * p,
        from[3] + (to[3] - from[3]) * p,
      ]);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // ตั้งใจให้ทำงานเมื่อเป้าหมายเปลี่ยนเท่านั้น ไม่ผูกกับ viewBox ระหว่างอนิเมชัน
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  /** u(px) = แปลงขนาดที่อยากได้เป็นพิกเซลบนจอ ให้เป็นหน่วยของ SVG */
  const pxPerUnit = Math.min(box.w / viewBox[2], box.h / viewBox[3]) || 1;
  const u = (px: number) => px / pxPerUnit;

  /* จอเล็กมีพื้นที่แนวตั้งน้อย ฟองตัวเลขรายภาคจะเบียดกันแถวภาคกลาง
     จึงย่อฟองและตัวอักษรลงตามความสูงจริงของกล่อง */
  const compact = box.h < 430;
  const zoomed = Boolean(selectedRegion || selectedProvince);
  const activeRegion = selectedProvince
    ? provinceById[selectedProvince]?.region ?? selectedRegion
    : selectedRegion;

  /**
   * รูปจังหวัดทั้ง 77 จังหวัดมีจุดรวมกันหกพันกว่าจุด
   * จึงแยก useMemo ไว้ต่างหากไม่ให้ React ไปไล่เทียบใหม่ทุกเฟรมตอนแผนที่กำลังซูม
   */
  const provinceLayer = useMemo(
    () => (
      <g>
        {regions.map((r) => {
          const dim = Boolean(activeRegion) && activeRegion !== r.id;
          return (
            <g
              key={r.id}
              className={cn("rc-region", !selectedProvince && !dim && "rc-region--hot")}
              style={{ opacity: dim ? 0.3 : 1, transition: "opacity 300ms" }}
            >
              {shapesInRegion(r.id).map((p) => {
                const count = counts.byProvince[p.id] ?? 0;
                const isSel = selectedProvince === p.id;
                return (
                  <path
                    key={p.id}
                    d={p.d}
                    fill={
                      isSel
                        ? "color-mix(in srgb, var(--brand) 82%, var(--map-land))"
                        : heatFill[heatLevel(count, counts.maxProvince)]
                    }
                    stroke={isSel ? "var(--brand)" : "var(--map-land-edge)"}
                    strokeWidth={isSel ? 1.2 : 0.45}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer"
                    onClick={guardClick(() => {
                      if (activeRegion === r.id) onSelectProvince(p.id);
                      else {
                        onSelectProvince(null);
                        onSelectRegion(r.id);
                      }
                    })}
                  >
                    <title>{`${p.name} — ${count} สถานี`}</title>
                  </path>
                );
              })}
            </g>
          );
        })}
      </g>
    ),
    [counts, activeRegion, selectedProvince, onSelectProvince, onSelectRegion, guardClick],
  );

  /* ── หมุดสถานีของจังหวัดที่เลือก — คลี่หมุดที่ทับกันออกเป็นวง ── */
  const visibleStations = useMemo(() => {
    if (!selectedProvince) return [];
    const list = stations
      .filter((s) => s.provinceId === selectedProvince)
      .map((s) => {
        const [x, y] = project(s.lng, s.lat);
        return { station: s, x, y };
      });

    const minGap = u(30);
    const groups: Array<typeof list> = [];
    for (const item of list) {
      const g = groups.find(
        (grp) => Math.hypot(grp[0].x - item.x, grp[0].y - item.y) < minGap,
      );
      if (g) g.push(item);
      else groups.push([item]);
    }

    return groups.flatMap((grp) => {
      if (grp.length === 1) return grp;
      const cx = grp.reduce((n, q) => n + q.x, 0) / grp.length;
      const cy = grp.reduce((n, q) => n + q.y, 0) / grp.length;
      const spread = u(20 + grp.length * 10);
      return grp.map((q, i) => {
        const angle = (i / grp.length) * Math.PI * 2 - Math.PI / 2;
        return {
          station: q.station,
          x: cx + Math.cos(angle) * spread,
          y: cy + Math.sin(angle) * spread,
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, selectedProvince, pxPerUnit]);

  const regionProvinces = activeRegion ? shapesInRegion(activeRegion) : [];

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <svg
        ref={svgRef}
        viewBox={viewBox.join(" ")}
        className="h-full w-full select-none cursor-grab active:cursor-grabbing"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="แผนที่สถานีชาร์จทั่วประเทศไทย — ลากเพื่อเลื่อน หนีบนิ้วหรือหมุนล้อเพื่อซูม"
        // ต้องปิดท่าทางของเบราว์เซอร์ ไม่งั้นการหนีบนิ้วจะไปซูมทั้งหน้าเว็บแทน
        style={{ touchAction: wheelMode === "off" ? "auto" : "none" }}
        {...handlers}
      >
        <defs>
          <filter id="rc-map-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy={u(2)} stdDeviation={u(3)} floodOpacity="0.2" />
          </filter>
        </defs>

        {provinceLayer}

        {/* ── ระดับประเทศ: ฟองตัวเลขรวมรายภาค ── */}
        {!zoomed && (
          <g>
            {regions.map((r) => {
              const count = counts.byRegion[r.id] ?? 0;
              const [cx, cy] = regionAnchor[r.id];
              const rad = u((compact ? 12 : 17) + Math.min(compact ? 5 : 9, count * (compact ? 0.3 : 0.45)));
              return (
                <g
                  key={r.id}
                  className="cursor-pointer"
                  onClick={guardClick(() => {
                    onSelectProvince(null);
                    onSelectRegion(r.id);
                  })}
                >
                  <circle cx={cx} cy={cy} r={rad + u(compact ? 4 : 6)} fill="var(--brand)" opacity={0.14} />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={rad}
                    fill="var(--surface)"
                    stroke="var(--brand)"
                    strokeWidth={u(2)}
                    filter="url(#rc-map-shadow)"
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={rad * 0.8}
                    fontWeight={700}
                    fill="var(--brand)"
                  >
                    {count}
                  </text>
                  <text
                    x={cx}
                    y={cy + rad + u(compact ? 11 : 14)}
                    textAnchor="middle"
                    fontSize={u(compact ? 10.5 : 13)}
                    fontWeight={700}
                    fill="var(--fg-muted)"
                    stroke="var(--bg)"
                    strokeWidth={u(3)}
                    paintOrder="stroke"
                  >
                    {r.short}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ── ระดับภาค: ชื่อจังหวัดและจำนวนสถานี ── */}
        {zoomed && (
          <g>
            {regionProvinces.map((p) => {
              const count = counts.byProvince[p.id] ?? 0;
              const isSel = selectedProvince === p.id;
              const [x, y] = provinceById[p.id]?.pin ?? p.label;
              const showBadge = count > 0 && !isSel;

              return (
                <g
                  key={p.id}
                  className="cursor-pointer"
                  onClick={guardClick(() => onSelectProvince(p.id))}
                  opacity={selectedProvince && !isSel ? 0.75 : 1}
                >
                  {showBadge && (
                    <>
                      <circle cx={x} cy={y} r={u(11)} fill="var(--brand)" stroke="var(--surface)" strokeWidth={u(1.5)} filter="url(#rc-map-shadow)" />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={u(11)}
                        fontWeight={700}
                        fill="#fff"
                      >
                        {count}
                      </text>
                    </>
                  )}
                  <text
                    x={x}
                    y={showBadge ? y + u(22) : y + u(4)}
                    textAnchor="middle"
                    fontSize={u(count > 0 ? 12.5 : 11)}
                    fontWeight={count > 0 ? 700 : 400}
                    fill={isSel ? "var(--brand)" : count > 0 ? "var(--fg)" : "var(--fg-faint)"}
                    stroke="var(--bg)"
                    strokeWidth={u(2.5)}
                    paintOrder="stroke"
                  >
                    {p.name}
                  </text>
                  <title>{`${p.name} — ${count} สถานี`}</title>
                </g>
              );
            })}
          </g>
        )}

        {/* ── ระดับจังหวัด: หมุดรายสถานี ── */}
        {selectedProvince && (
          <g>
            {visibleStations.map(({ station: s, x, y }) => {
              const sel = selectedStationId === s.id;
              const r = u(11);
              return (
                <g
                  key={s.id}
                  className="cursor-pointer"
                  onClick={guardClick(() => onSelectStation?.(s.id))}
                  onMouseEnter={() => setHoveredPin(s.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <circle cx={x} cy={y} r={r + u(14)} fill="transparent" />
                  <circle
                    cx={x}
                    cy={y}
                    r={r + u(sel ? 7 : 4)}
                    fill="var(--brand)"
                    opacity={sel || hoveredPin === s.id ? 0.32 : 0.16}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={sel ? "var(--brand)" : "var(--surface)"}
                    stroke="var(--brand)"
                    strokeWidth={u(2)}
                    filter="url(#rc-map-shadow)"
                  />
                  <path
                    d="M13.5 2.5L5 13.5h5.5L10 21.5l8.5-11H13l.5-8z"
                    transform={`translate(${x - r * 0.58} ${y - r * 0.6}) scale(${(r * 1.18) / 24})`}
                    fill={sel ? "#fff" : "var(--brand)"}
                    stroke="none"
                  />
                  <text
                    x={x}
                    y={y + r + u(14)}
                    textAnchor="middle"
                    fontSize={u(11.5)}
                    fontWeight={400}
                    fill="var(--fg)"
                    stroke="var(--bg)"
                    strokeWidth={u(3)}
                    paintOrder="stroke"
                  >
                    {s.name.length > 15 ? s.name.slice(0, 14) + "…" : s.name}
                  </text>
                  <title>{s.name}</title>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* ── ปุ่มซูม ── */}
      {wheelMode !== "off" && (
        <div className="absolute bottom-3 left-3 flex flex-col overflow-hidden rounded-xl border border-border bg-surface/95 shadow-card backdrop-blur">
          <button
            type="button"
            onClick={() => zoomCenter(1 / 1.45)}
            aria-label="ซูมเข้า"
            className="grid h-9 w-9 place-items-center text-fg-muted transition-colors hover:bg-surface-hover hover:text-brand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <span className="h-px bg-border" />
          <button
            type="button"
            onClick={() => zoomCenter(1.45)}
            aria-label="ซูมออก"
            className="grid h-9 w-9 place-items-center text-fg-muted transition-colors hover:bg-surface-hover hover:text-brand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      )}

      {/* ── บอกวิธีซูมเมื่อผู้ใช้หมุนล้อบนแผนที่ที่ฝังอยู่ในหน้าที่เลื่อนได้ ── */}
      {wheelHint && (
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center rounded-[inherit] bg-[var(--rc-ink-950)]/35 backdrop-blur-[1px]"
          style={{ animation: "rc-fade-in 160ms ease-out both" }}
        >
          <p className="rounded-full bg-[var(--rc-ink-900)]/90 px-5 py-3 text-[0.875rem] font-bold text-white">
            กด Ctrl หรือ ⌘ ค้างไว้แล้วหมุนล้อ เพื่อซูมแผนที่
          </p>
        </div>
      )}

      {/* ── ปุ่มย้อนกลับ ── */}
      {zoomed && (
        <button
          type="button"
          onClick={() =>
            selectedProvince ? onSelectProvince(null) : onSelectRegion(null)
          }
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/95 px-3.5 py-2 text-[0.8125rem] text-fg shadow-card backdrop-blur transition-colors hover:border-brand hover:text-brand"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.5 6l-6 6 6 6" />
          </svg>
          {selectedProvince ? "กลับไปดูทั้งภาค" : "ดูทั้งประเทศ"}
        </button>
      )}

      {/* ── ป้ายบอกจังหวัดที่กำลังดู ── */}
      {selectedProvince && (
        /* จอแคบวางป้ายไว้ใต้ปุ่มย้อนกลับ ไม่งั้นสองอันจะทับกัน */
        <div className="pointer-events-none absolute left-1/2 top-[3.5rem] -translate-x-1/2 rounded-full border border-border bg-surface/95 px-4 py-2 shadow-card backdrop-blur sm:top-3">
          <p className="text-[0.8125rem] text-fg">
            {provinceById[selectedProvince]?.name}
            <span className="ml-2 font-normal text-fg-muted">
              {visibleStations.length} สถานี
            </span>
          </p>
        </div>
      )}

      {/* ── คำอธิบายระดับความหนาแน่น ── */}
      {!zoomed && (
        <div className="absolute bottom-3 right-3 hidden items-center gap-2 rounded-full border border-border bg-surface/95 px-3 py-2 backdrop-blur sm:flex">
          <span className="t-caption">น้อย</span>
          <span className="flex gap-0.5">
            {heatFill.map((f, i) => (
              <span key={i} className="h-3.5 w-5 rounded-sm" style={{ background: f }} />
            ))}
          </span>
          <span className="t-caption">มาก</span>
        </div>
      )}
    </div>
  );
}
