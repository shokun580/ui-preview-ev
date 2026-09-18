"use client";

import { useEffect } from "react";
import {
  amenityLabels,
  connectorInfo,
  networks,
  speedLabels,
  type AmenityId,
  type ConnectorType,
  type NetworkId,
  type SpeedTier,
} from "@/data/stations";
import { countActive, emptyFilters, type Filters } from "./filters";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] transition-all",
        active
          ? "border-brand bg-brand-soft text-brand-soft-fg"
          : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {active && <Icon name="check" size={13} />}
      {children}
    </button>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <h3 className="text-[0.9375rem] font-bold text-fg">{title}</h3>
      {hint && <p className="t-caption mt-0.5">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const priceSteps = [7, 7.5, 8];

export function FilterSheet({
  open,
  filters,
  onChange,
  onClose,
  resultCount,
}: {
  open: boolean;
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose: () => void;
  resultCount: number;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  const active = countActive(filters);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[var(--rc-ink-950)]/55 backdrop-blur-sm"
        style={{ animation: "rc-fade-in 180ms ease-out both" }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ตัวกรองสถานีชาร์จ"
        className="relative flex max-h-[88vh] w-full flex-col rounded-t-3xl border border-border bg-bg shadow-pop sm:max-w-xl sm:rounded-3xl"
        style={{ animation: "rc-slide-up 280ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 className="t-h3">ตัวกรอง</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-fg-muted hover:text-fg"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <Group title="ประเภทหัวชาร์จ" hint="เลือกได้มากกว่าหนึ่ง — ระบบจะแสดงสถานีที่มีหัวใดหัวหนึ่งที่เลือก">
            {(Object.keys(connectorInfo) as ConnectorType[]).map((c) => (
              <Chip
                key={c}
                active={filters.connectors.includes(c)}
                onClick={() => onChange({ ...filters, connectors: toggle(filters.connectors, c) })}
              >
                {c}
                <span className="font-normal opacity-60">{connectorInfo[c].current}</span>
              </Chip>
            ))}
          </Group>

          <Group title="ความเร็วในการชาร์จ">
            {(Object.keys(speedLabels) as SpeedTier[]).map((s) => (
              <Chip
                key={s}
                active={filters.speeds.includes(s)}
                onClick={() => onChange({ ...filters, speeds: toggle(filters.speeds, s) })}
              >
                {speedLabels[s]}
              </Chip>
            ))}
          </Group>

          <Group title="ผู้ให้บริการ">
            {(Object.keys(networks) as NetworkId[]).map((n) => (
              <Chip
                key={n}
                active={filters.networks.includes(n)}
                onClick={() => onChange({ ...filters, networks: toggle(filters.networks, n) })}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: networks[n].color }}
                />
                {networks[n].name}
              </Chip>
            ))}
          </Group>

          <Group title="เวลาเปิดทำการ">
            <Chip
              active={filters.open24}
              onClick={() => onChange({ ...filters, open24: !filters.open24 })}
            >
              เปิด 24 ชั่วโมง
            </Chip>
          </Group>

          <Group title="ราคาต่อหน่วย" hint="แสดงเฉพาะสถานีที่ราคาไม่เกินที่เลือก">
            {priceSteps.map((p) => (
              <Chip
                key={p}
                active={filters.maxPrice === p}
                onClick={() => onChange({ ...filters, maxPrice: filters.maxPrice === p ? null : p })}
              >
                ไม่เกิน ฿{p.toFixed(2)}
              </Chip>
            ))}
          </Group>

          <Group title="สิ่งอำนวยความสะดวก" hint="เลือกหลายอย่างจะแสดงเฉพาะสถานีที่มีครบทุกข้อ">
            {(Object.keys(amenityLabels) as AmenityId[]).map((a) => (
              <Chip
                key={a}
                active={filters.amenities.includes(a)}
                onClick={() => onChange({ ...filters, amenities: toggle(filters.amenities, a) })}
              >
                {amenityLabels[a]}
              </Chip>
            ))}
          </Group>
        </div>

        <div
          className="flex shrink-0 items-center gap-3 border-t border-border px-5 py-4"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={() => onChange(emptyFilters)}
            disabled={active === 0}
            className="t-button rounded-full px-4 py-2.5 text-fg-muted underline-offset-4 hover:underline disabled:opacity-40"
          >
            ล้างทั้งหมด
          </button>
          <Button onClick={onClose} size="md" className="ml-auto flex-1 sm:flex-none">
            ดูผลลัพธ์ {resultCount} แห่ง
          </Button>
        </div>
      </div>
    </div>
  );
}
