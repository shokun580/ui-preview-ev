"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const priceProfiles = [
  { id: "home", label: "ชาร์จที่บ้าน", price: 4.5 },
  { id: "home-tou", label: "บ้าน อัตรากลางคืน", price: 2.9 },
  { id: "public", label: "สถานีสาธารณะ", price: 7.5 },
];

const carProfiles = [
  { id: "small", label: "เก๋งเล็ก", rate: 14 },
  { id: "sedan", label: "เก๋งทั่วไป", rate: 17 },
  { id: "suv", label: "SUV", rate: 21 },
];

/** เครื่องคำนวณค่าชาร์จอย่างง่าย — คิดจาก อัตราสิ้นเปลือง × ราคาต่อหน่วย */
export function CostCalculator() {
  const [rate, setRate] = useState(17);
  const [price, setPrice] = useState(4.5);
  const [distance, setDistance] = useState(600);

  const per100 = rate * price;
  const totalCost = (distance / 100) * per100;
  // เทียบกับรถน้ำมันที่กิน 14 กม./ลิตร ราคาน้ำมัน 38 บาท/ลิตร เพื่อให้เห็นภาพ
  const petrolCost = (distance / 14) * 38;
  const saving = petrolCost - totalCost;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-panel border border-border bg-surface">
      <div className="flex items-center gap-2.5 border-b border-border bg-bg-subtle px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand-soft-fg">
          <Icon name="calculator" size={18} />
        </span>
        <div>
          <h3 className="text-[1rem] font-bold text-fg">ลองคำนวณค่าชาร์จของคุณ</h3>
          <p className="t-caption">ปรับตัวเลขให้ตรงกับรถและที่ที่คุณชาร์จบ่อย</p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {/* รถ */}
        <div>
          <label className="text-[0.875rem] text-fg">
            รถกินไฟประมาณ <span className="t-num text-brand">{rate}</span> kWh ต่อ 100 กม.
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {carProfiles.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setRate(c.rate)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                  rate === c.rate
                    ? "border-brand bg-brand-soft text-brand-soft-fg"
                    : "border-border text-fg-muted hover:border-border-strong",
                )}
              >
                {c.label} · {c.rate}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={10}
            max={28}
            step={1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            aria-label="อัตราสิ้นเปลือง kWh ต่อ 100 กิโลเมตร"
            className="mt-3 w-full accent-[var(--brand)]"
          />
        </div>

        {/* ราคา */}
        <div>
          <label className="text-[0.875rem] text-fg">
            ราคาต่อหน่วย <span className="t-num text-brand">฿{price.toFixed(2)}</span>
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {priceProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPrice(p.price)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                  price === p.price
                    ? "border-brand bg-brand-soft text-brand-soft-fg"
                    : "border-border text-fg-muted hover:border-border-strong",
                )}
              >
                {p.label} · ฿{p.price.toFixed(2)}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={0.1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            aria-label="ราคาต่อหน่วย"
            className="mt-3 w-full accent-[var(--brand)]"
          />
        </div>

        {/* ระยะทาง */}
        <div>
          <label className="text-[0.875rem] text-fg">
            ขับเดือนละประมาณ <span className="t-num text-brand">{distance.toLocaleString("th-TH")}</span> กม.
          </label>
          <input
            type="range"
            min={100}
            max={3000}
            step={50}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            aria-label="ระยะทางต่อเดือน"
            className="mt-3 w-full accent-[var(--brand)]"
          />
        </div>

        {/* ผลลัพธ์ */}
        <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
          <div className="rounded-card bg-bg-subtle p-4">
            <p className="t-caption">ต่อ 100 กิโลเมตร</p>
            <p className="t-h2 t-num mt-1 text-fg">฿{per100.toFixed(0)}</p>
          </div>
          <div className="rounded-card bg-brand-soft p-4">
            <p className="t-caption text-brand-soft-fg/70">ค่าชาร์จต่อเดือน</p>
            <p className="t-h2 t-num mt-1 text-brand-soft-fg">
              ฿{totalCost.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-card bg-bg-subtle p-4">
            <p className="t-caption">ถ้าเป็นรถน้ำมัน</p>
            <p className="t-h2 t-num mt-1 text-fg-muted">
              ฿{petrolCost.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <p className="flex items-start gap-2 rounded-xl bg-accent-soft px-4 py-3 text-[0.875rem] text-accent-soft-fg">
          <Icon name="sparkle" size={17} className="mt-0.5 shrink-0" />
          <span>
            ต่างกันประมาณ{" "}
            <strong className="font-bold">
              ฿{Math.abs(saving).toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </strong>{" "}
            ต่อเดือน (เทียบกับรถน้ำมันที่กิน 14 กม./ลิตร ราคาน้ำมัน 38 บาท/ลิตร)
          </span>
        </p>
      </div>
    </div>
  );
}
