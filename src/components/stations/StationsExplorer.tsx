"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ThailandMap } from "@/components/map/ThailandMap";
import { StationCard } from "./StationCard";
import { StationDetailPanel } from "./StationDetailPanel";
import { StationDetailBody } from "./StationDetail";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { FilterSheet } from "./FilterSheet";
import {
  applyFilters,
  countActive,
  emptyFilters,
  recommendScore,
  sortLabels,
  type Filters,
  type SortKey,
} from "./filters";
import { provinces, provincesInRegion, regionById, type RegionId } from "@/data/geo";
import {
  stationById,
  stations as allStations,
  type Station,
} from "@/data/stations";
import { Icon } from "@/components/ui/Icon";
import { StationCardSkeleton } from "@/components/ui/Skeleton";
import { cn, distanceKm } from "@/lib/utils";

type Geo = { lat: number; lng: number };

export function StationsExplorer({ initialProvince }: { initialProvince?: string }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [region, setRegion] = useState<RegionId | null>(
    initialProvince ? (provinces.find((p) => p.id === initialProvince)?.region ?? null) : null,
  );
  const [province, setProvince] = useState<string | null>(initialProvince ?? null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coords, setCoords] = useState<Geo | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error" | "ok">("idle");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  /* จุดหยุดของแผ่นเลื่อนบนมือถือ: แอบโผล่ / ครึ่งจอ / เต็มจอ
     ระดับกลางคือค่าเริ่มต้น เพราะเห็นทั้งแผนที่และรายการพร้อมกัน */
  const SHEET_SNAPS = [0.14, 0.5, 0.92];
  const [sheetIndex, setSheetIndex] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  /* ── หน่วงการค้นหาไว้เล็กน้อย ไม่ให้กรองใหม่ทุกตัวอักษร ── */
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const results = useMemo(() => {
    const base = applyFilters(allStations, {
      query: debounced,
      provinceId: province,
      region,
      filters,
    });

    const withDistance = base.map((s) => ({
      station: s,
      distance: coords ? distanceKm(coords, { lat: s.lat, lng: s.lng }) : undefined,
    }));

    const sorted = [...withDistance];
    switch (sort) {
      case "distance":
        sorted.sort((a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9));
        break;
      case "price":
        sorted.sort((a, b) => a.station.pricePerKwh - b.station.pricePerKwh);
        break;
      case "rating":
        sorted.sort((a, b) => b.station.rating - a.station.rating);
        break;
      default:
        // แนะนำ = คะแนนทีมสำรวจผสมความเร็วและราคา (ดู recommendScore ใน filters.ts)
        sorted.sort((a, b) => recommendScore(b.station) - recommendScore(a.station));
    }
    return sorted;
  }, [debounced, province, region, filters, sort, coords]);

  /* ── โครงร่างระหว่างค้นหา ทำให้รู้สึกเหมือนระบบกำลังทำงานจริง ── */
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(id);
  }, [debounced, province, region, filters, sort]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [province, region, sort]);

  const selected: Station | null = selectedId ? stationById[selectedId] : null;
  const selectedDistance = selected && coords
    ? distanceKm(coords, { lat: selected.lat, lng: selected.lng })
    : undefined;

  /** เลือกสถานี — บนมือถือคลี่แผงขึ้นเต็มด้วย ไม่งั้นรายละเอียดจะโผล่มาแค่เสี้ยวเดียว */
  function selectStation(id: string, provinceOfStation?: string) {
    setSelectedId(id);
    // เปิดที่ระดับครึ่งจอ เห็นรายละเอียดส่วนต้นพร้อมกับตำแหน่งบนแผนที่
    // อยากอ่านต่อก็ลากขึ้นเอง แบบเดียวกับตอนกดหมุดใน Google Maps
    setSheetIndex(1);
    if (!province && provinceOfStation) setProvince(provinceOfStation);
  }

  /**
   * ขอตำแหน่งจากเบราว์เซอร์
   *
   * ความล้มเหลวมีได้หลายสาเหตุและวิธีแก้คนละทางกันหมด
   * ถ้าบอกผู้ใช้แค่ "อ่านตำแหน่งไม่ได้" เขาจะไม่รู้ว่าต้องไปทำอะไรต่อ
   * จึงแยกข้อความตามสาเหตุจริง
   */
  function locateMe() {
    setGeoError(null);

    if (!("geolocation" in navigator)) {
      setGeoState("error");
      setGeoError("เบราว์เซอร์นี้ไม่รองรับการอ่านตำแหน่ง");
      return;
    }

    // เบราว์เซอร์ยอมให้อ่านตำแหน่งเฉพาะหน้าที่เปิดผ่าน https หรือ localhost เท่านั้น
    // เปิดผ่าน IP ในวงแลน (เช่นตอนทดสอบบนมือถือ) จะถูกปิดกั้นตั้งแต่ต้น
    if (!window.isSecureContext) {
      setGeoState("error");
      setGeoError(
        "หน้านี้เปิดผ่านการเชื่อมต่อที่ไม่ปลอดภัย เบราว์เซอร์จึงไม่ให้อ่านตำแหน่ง — ต้องเปิดผ่าน https หรือ localhost",
      );
      return;
    }

    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("ok");
        setSort("distance");
        setRegion(null);
        setProvince(null);
      },
      (err) => {
        setGeoState("error");
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "สิทธิ์เข้าถึงตำแหน่งถูกปิดไว้ — กดไอคอนหน้าช่องที่อยู่เว็บ แล้วเปลี่ยนตำแหน่งที่ตั้งเป็น “อนุญาต” จากนั้นลองใหม่"
            : err.code === err.POSITION_UNAVAILABLE
              ? "หาตำแหน่งไม่เจอ — ตรวจว่าเปิดบริการระบุตำแหน่งของเครื่องไว้หรือยัง"
              : "ใช้เวลานานเกินไป ลองใหม่อีกครั้ง",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const activeFilterCount = countActive(filters);
  const provinceOptions = region ? provincesInRegion(region) : provinces;

  /* ── แถบเครื่องมือ (ใช้ซ้ำทั้งใน panel และบนมือถือ) ── */
  const searchInput = (
    <div className="relative">
      <Icon
        name="search"
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-faint"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาชื่อสถานี ห้าง หรือจังหวัด"
        aria-label="ค้นหาสถานีชาร์จ"
        className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-[0.9375rem] text-fg placeholder:text-fg-faint focus:border-brand focus:outline-none"
      />
    </div>
  );

  const filterButton = (
    <button
      type="button"
      onClick={() => setOpenFilters(true)}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] transition-colors",
        activeFilterCount
          ? "border-brand bg-brand-soft text-brand-soft-fg"
          : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      <Icon name="filter" size={16} />
      ตัวกรอง
      {activeFilterCount > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.6875rem] text-white">
          {activeFilterCount}
        </span>
      )}
    </button>
  );

  const scopeChips = (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
      <select
        value={province ?? ""}
        onChange={(e) => {
          const v = e.target.value || null;
          setProvince(v);
          if (v) setRegion(provinces.find((p) => p.id === v)?.region ?? null);
        }}
        aria-label="เลือกจังหวัด"
        className="h-10 shrink-0 rounded-full border border-border bg-surface px-3.5 text-[0.8125rem] text-fg-muted focus:border-brand focus:outline-none"
      >
        <option value="">ทุกจังหวัด</option>
        {provinceOptions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={locateMe}
        className={cn(
          "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] transition-colors",
          geoState === "ok"
            ? "border-brand bg-brand-soft text-brand-soft-fg"
            : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
        )}
      >
        <Icon
          name={geoState === "loading" ? "refresh" : "target"}
          size={16}
          className={geoState === "loading" ? "animate-spin" : undefined}
        />
        ใกล้ฉัน
      </button>

      {filterButton}
    </div>
  );

  const listBody = (
    <>
      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StationCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-sunken text-fg-faint">
            <Icon name="search" size={24} />
          </span>
          <p className="t-h3 mt-4">ไม่พบสถานีที่ตรงกับเงื่อนไข</p>
          <p className="t-body-sm mt-1 text-fg-muted">
            ลองลดตัวกรองลง หรือขยายพื้นที่ค้นหาเป็นทั้งภาค
          </p>
          <button
            type="button"
            onClick={() => {
              setFilters(emptyFilters);
              setQuery("");
              setProvince(null);
              setRegion(null);
            }}
            className="t-button mt-4 rounded-full border border-border-strong px-5 py-2.5 text-fg hover:border-brand hover:text-brand"
          >
            ล้างเงื่อนไขทั้งหมด
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {results.map(({ station, distance }) => (
            <StationCard
              key={station.id}
              station={station}
              distance={distance}
              active={selectedId === station.id}
              onClick={() => selectStation(station.id, station.provinceId)}
            />
          ))}
          <p className="t-caption py-4 text-center">
            แสดง {results.length} สถานีจากทั้งหมด {allStations.length} แห่งในระบบ
          </p>
        </div>
      )}
    </>
  );

  /* แถวชิปสำหรับมือถือ — ไม่มี "ใกล้ฉัน" เพราะย้ายไปเป็นปุ่มลอยข้างแผนที่
     แบบเดียวกับปุ่มกลับไปตำแหน่งตัวเองในแอปแผนที่ทั่วไป */
  const mobileChips = (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-1">
      <select
        value={province ?? ""}
        onChange={(e) => {
          const v = e.target.value || null;
          setProvince(v);
          if (v) setRegion(provinces.find((p) => p.id === v)?.region ?? null);
        }}
        aria-label="เลือกจังหวัด"
        className="h-9 shrink-0 rounded-full border border-border bg-bg/90 px-3.5 text-[0.8125rem] text-fg-muted shadow-card backdrop-blur focus:border-brand focus:outline-none"
      >
        <option value="">ทุกจังหวัด</option>
        {provinceOptions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setOpenFilters(true)}
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] shadow-card backdrop-blur transition-colors",
          activeFilterCount
            ? "border-brand bg-brand-soft text-brand-soft-fg"
            : "border-border bg-bg/90 text-fg-muted",
        )}
      >
        <Icon name="filter" size={15} />
        ตัวกรอง
        {activeFilterCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.6875rem] text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
      {region && (
        <button
          type="button"
          onClick={() => {
            setRegion(null);
            setProvince(null);
          }}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-brand bg-brand-soft px-3.5 text-[0.8125rem] text-brand-soft-fg shadow-card backdrop-blur"
        >
          {province
            ? provinces.find((p) => p.id === province)?.name
            : regionById[region].name}
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );

  const resultHeader = (
    <div className="flex items-center gap-2 px-4 pb-2">
      <p className="t-caption">
        {loading ? "กำลังค้นหา…" : (
          <>
            พบ <strong className="text-fg">{results.length}</strong> สถานี
            {province && ` ใน${provinces.find((p) => p.id === province)?.name}`}
            {!province && region && ` ใน${regionById[region].name}`}
          </>
        )}
      </p>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        aria-label="เรียงลำดับ"
        className="ml-auto h-8 rounded-full border border-border bg-surface px-2.5 text-[0.75rem] text-fg-muted focus:border-brand focus:outline-none"
      >
        {(Object.keys(sortLabels) as SortKey[]).map((k) => (
          <option key={k} value={k} disabled={k === "distance" && !coords}>
            {sortLabels[k]}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    /* สูงเท่าหน้าจอลบความสูง header พอดี ไม่มีอะไรเกินให้เลื่อน
       ล้อเมาส์จึงตกไปเป็นหน้าที่ของการซูมแผนที่ทั้งหมด
       บนมือถือเผื่อที่ให้แถบเมนูลอยด้านล่างด้วย */
    /* ลบอีก 1px เพราะแถบเมนูบนมี border-b ซึ่งกินความสูงเพิ่มจาก h-16 ไปหนึ่งพิกเซล
       ถ้าไม่ลบ ขอบล่างของ section จะไปทับแถบเมนูล่างพอดีหนึ่งพิกเซล */
    <section className="relative h-[calc(100dvh-4rem-1px-var(--rc-dock-h)-env(safe-area-inset-bottom))] overflow-hidden bg-bg-subtle md:h-[calc(100dvh-4rem-1px)] lg:h-[calc(100dvh-4.5rem-1px)]">
      {/* ── แผนที่ ──
          บนมือถือแผนที่เต็มจอ ทุกอย่างลอยทับ แบบเดียวกับแอปแผนที่
          เว้นที่ด้านบนไว้ให้แถบค้นหา และเว้นด้านล่างไว้ให้แผ่นเลื่อนที่ระดับกลาง */}
      <div className="absolute inset-0 md:left-[20rem] lg:left-0">
        {/* บนมือถือ ที่ว่างด้านล่างของแผนที่ผูกกับความสูงแผ่นเลื่อนจริง ๆ ผ่านตัวแปร --rc-sheet-h
            ลากแผ่นลง แผนที่ก็ขยายตามทันที ไม่ใช่ค่าคงที่ที่ทิ้งที่ว่างเปล่า ๆ ไว้
            คูณ 0.55 เพราะยอมให้ปลายแผนที่มุดใต้แผ่นได้นิดหน่อย จะได้วาดได้ใหญ่ขึ้น
            ส่วนปุ่มใกล้ฉันกับปุ่มซูมลอยทับแผนที่อยู่คนละชั้น ไม่กินที่ในผังนี้ */}
        <div
          className={cn(
            "rc-map-frame h-full w-full px-3 pt-[5.75rem] transition-[padding] duration-300 md:p-4 md:pt-4 lg:py-6 lg:pr-6",
            selectedId ? "lg:pl-[55rem]" : "lg:pl-[28rem]",
          )}
        >
          <ThailandMap
            className="h-full w-full"
            stations={results.map((r) => r.station)}
            selectedRegion={region}
            selectedProvince={province}
            selectedStationId={selectedId}
            onSelectRegion={setRegion}
            onSelectProvince={setProvince}
            onSelectStation={(id) => selectStation(id)}
          />
        </div>
      </div>

      {/* ── แถบค้นหาและชิปลอยด้านบน เฉพาะมือถือ ── */}
      <div className="absolute inset-x-0 top-0 z-30 space-y-2 pt-3 md:hidden">
        <div className="flex gap-2 px-3">
          <div className="flex-1">{searchInput}</div>
        </div>
        {mobileChips}
      </div>

      {/* ── ปุ่มกลับไปตำแหน่งฉัน ลอยเหนือแผ่นเลื่อน ── */}
      <button
        type="button"
        onClick={locateMe}
        aria-label="ค้นหาสถานีใกล้ฉัน"
        className={cn(
          "absolute right-3 z-30 grid h-12 w-12 place-items-center rounded-full border border-border shadow-pop backdrop-blur transition-colors md:hidden",
          geoState === "ok" ? "bg-brand text-white" : "bg-bg/92 text-fg",
        )}
        style={{ bottom: "calc(var(--rc-sheet-h, 50%) + 0.75rem)" }}
      >
        <Icon
          name={geoState === "loading" ? "refresh" : "target"}
          size={21}
          className={geoState === "loading" ? "animate-spin" : undefined}
        />
      </button>

      {/* ── รายการผลลัพธ์ (จอ md ขึ้นไป) ── */}
      <aside
        className={cn(
          "absolute z-40 hidden flex-col overflow-hidden border border-border bg-bg md:flex",
          "md:inset-y-0 md:left-0 md:right-auto md:w-[20rem] md:border-y-0 md:border-l-0 md:shadow-none",
          "lg:inset-y-6 lg:left-6 lg:w-[25.5rem] lg:rounded-panel lg:border lg:shadow-pop",
        )}
      >
        <div className="shrink-0 space-y-2.5 border-b border-border px-4 pb-3 pt-4">
          {searchInput}
          {scopeChips}
        </div>

        <div className="pt-2.5">{resultHeader}</div>

        {geoState === "error" && geoError && (
          <div className="mx-4 mb-2 shrink-0 rounded-xl bg-warn-soft px-3 py-2.5">
            <p className="text-[0.8125rem] leading-relaxed text-warn">{geoError}</p>
            <button
              type="button"
              onClick={locateMe}
              className="mt-1.5 text-[0.8125rem] font-bold text-warn underline underline-offset-4"
            >
              ลองอีกครั้ง
            </button>
          </div>
        )}

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {listBody}
        </div>
      </aside>

      {/* ── แผ่นเลื่อนด้านล่าง เฉพาะมือถือ ── */}
      <BottomSheet
        className="md:hidden"
        snapPoints={SHEET_SNAPS}
        index={sheetIndex}
        onIndexChange={setSheetIndex}
        label={selected ? `รายละเอียด ${selected.name}` : "รายการสถานีชาร์จ"}
      >
        {selected ? (
          <div>
            <div className="flex items-center gap-1 border-b border-border px-2 pb-2">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.8125rem] font-bold text-fg-muted"
              >
                <Icon name="chevronLeft" size={17} />
                กลับไปรายการ
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="ปิด"
                className="ml-auto grid h-9 w-9 place-items-center rounded-full text-fg-faint"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <StationDetailBody
              station={selected}
              distance={selectedDistance}
              variant="panel"
            />
          </div>
        ) : (
          <>
            {resultHeader}
            {geoState === "error" && geoError && (
              <div className="mx-4 mb-2 rounded-xl bg-warn-soft px-3 py-2.5">
                <p className="text-[0.8125rem] leading-relaxed text-warn">{geoError}</p>
                <button
                  type="button"
                  onClick={locateMe}
                  className="mt-1.5 text-[0.8125rem] font-bold text-warn underline underline-offset-4"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            )}
            <div className="px-4 pb-4">{listBody}</div>
          </>
        )}
      </BottomSheet>

      {/* แผงรายละเอียดของจอ md ขึ้นไป — จอใหญ่เปิดเป็นแผงที่สองต่อจากรายการ */}
      <StationDetailPanel
        station={selected}
        distance={selectedDistance}
        onClose={() => setSelectedId(null)}
      />

      {/* ── ชั้นซ้อน ── */}
      <FilterSheet
        open={openFilters}
        filters={filters}
        onChange={setFilters}
        onClose={() => setOpenFilters(false)}
        resultCount={results.length}
      />
    </section>
  );
}
