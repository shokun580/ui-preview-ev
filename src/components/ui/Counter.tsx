"use client";

import { useEffect, useRef, useState } from "react";

/** นับตัวเลขขึ้นเมื่อเลื่อนมาถึง — ใช้กับแถบตัวเลขบนหน้าแรก */
export function Counter({
  to,
  duration = 1400,
  suffix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    // ไม่มี IntersectionObserver ก็แสดงเลขเต็มไปเลย ไม่ต้องรออะไร
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setValue(to));
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        // เคารพการตั้งค่า "ลดการเคลื่อนไหว" ของเครื่องผู้ใช้
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValue(to);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // ease-out cubic ให้ตัวเลขช้าลงตอนจบ อ่านง่ายกว่าแบบเชิงเส้น
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="t-num">
      {value.toLocaleString("th-TH")}
      {suffix}
    </span>
  );
}
