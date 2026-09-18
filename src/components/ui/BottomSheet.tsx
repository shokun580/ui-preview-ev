"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/* useLayoutEffect เตือนตอนเรนเดอร์ฝั่งเซิร์ฟเวอร์ จึงสลับเป็น useEffect เมื่อไม่มี window
   ต้องใช้ layout effect เพราะตำแหน่งแผ่นและตัวแปรความสูงต้องถูกตั้งก่อนวาดเฟรมแรก
   ไม่งั้นแผนที่ที่อ้างอิงตัวแปรนี้จะกระตุกหนึ่งเฟรมตอนโหลด */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { cn } from "@/lib/utils";

/**
 * แผ่นเลื่อนด้านล่างแบบเดียวกับแอป Google Maps บนมือถือ
 *
 * หัวใจอยู่ที่สามเรื่องที่คนมักทำหลุด:
 *
 *  1. **มีจุดหยุดหลายระดับ** (แอบโผล่ / ครึ่งจอ / เต็มจอ) ไม่ใช่เปิด-ปิดสองสถานะ
 *     ระดับกลางสำคัญที่สุด เพราะเห็นทั้งแผนที่และรายการพร้อมกัน
 *
 *  2. **ลากแล้วต้องตามนิ้วทันที** จึงเขียนค่า transform ลง DOM ตรง ๆ ระหว่างลาก
 *     ไม่ผ่าน React state ไม่งั้นจะหน่วงเพราะต้อง re-render ทุกเฟรม
 *
 *  3. **ปล่อยแล้วดูความเร็ว ไม่ใช่ดูแค่ตำแหน่ง** สะบัดเร็ว ๆ ต้องข้ามไปจุดถัดไป
 *     แม้นิ้วจะขยับไปไม่ถึงครึ่งทาง
 *
 * และที่สำคัญ: เนื้อหาข้างในจะเลื่อนได้ก็ต่อเมื่อแผ่นอยู่ที่ระดับสูงสุดแล้วเท่านั้น
 * ถ้ายังไม่สุด การลากในเนื้อหาคือการลากตัวแผ่น — ไม่งั้นผู้ใช้จะงงว่าทำไมบางทีลากแล้วแผ่นขยับ บางทีไม่ขยับ
 */
export function BottomSheet({
  snapPoints = [0.16, 0.52, 0.92],
  index,
  onIndexChange,
  children,
  className,
  /** ชื่อ CSS variable ที่จะเขียนความสูงปัจจุบันลงไป เผื่อให้ปุ่มลอยอื่น ๆ ขยับตาม */
  heightVar = "--rc-sheet-h",
  label,
}: {
  snapPoints?: number[];
  index: number;
  onIndexChange: (i: number) => void;
  children: ReactNode;
  className?: string;
  heightVar?: string;
  label?: string;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const drag = useRef({
    active: false,
    startY: 0,
    startTranslate: 0,
    lastY: 0,
    lastT: 0,
    velocity: 0,
    fromContent: false,
  });

  const containerH = useRef(0);

  const translateFor = useCallback(
    (i: number) => containerH.current * (1 - snapPoints[i]),
    [snapPoints],
  );

  /** เขียนตำแหน่งลง DOM ตรง ๆ พร้อมอัปเดตตัวแปร CSS ให้ของอื่นเกาะตาม */
  const applyTranslate = useCallback(
    (px: number) => {
      const el = sheetRef.current;
      if (!el) return;
      el.style.transform = `translate3d(0, ${px}px, 0)`;
      el.parentElement?.style.setProperty(
        heightVar,
        `${Math.max(0, containerH.current - px)}px`,
      );
      /* ตัวแผ่นสูงเต็มกรอบแล้วถูกเลื่อนลงด้วย transform
         ส่วนที่ล้นพ้นกรอบไปจึงโดนตัดทิ้ง (กรอบตั้ง overflow-hidden ไว้)
         ถ้าไม่เผื่อที่ว่างท้ายเนื้อหาเท่ากับส่วนที่ล้น จะเลื่อนดูรายการท้าย ๆ ไม่ถึง */
      el.style.setProperty("--rc-sheet-clipped", `${Math.max(0, px)}px`);
    },
    [heightVar],
  );

  const settle = useCallback(
    (i: number) => {
      const clamped = Math.min(snapPoints.length - 1, Math.max(0, i));
      applyTranslate(translateFor(clamped));
      if (clamped !== index) onIndexChange(clamped);
    },
    [applyTranslate, index, onIndexChange, snapPoints.length, translateFor],
  );

  /* ── วัดความสูงกรอบ แล้วจัดตำแหน่งใหม่เมื่อขนาดเปลี่ยน ── */
  useIsoLayoutEffect(() => {
    const el = sheetRef.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const measure = () => {
      containerH.current = host.getBoundingClientRect().height;
      if (!drag.current.active) applyTranslate(translateFor(index));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, [applyTranslate, index, translateFor]);

  /* ── ตำแหน่งเปลี่ยนจากภายนอก (เช่น กดหมุดบนแผนที่) ── */
  useIsoLayoutEffect(() => {
    if (!drag.current.active) applyTranslate(translateFor(index));
  }, [applyTranslate, index, translateFor]);

  const beginDrag = (clientY: number, fromContent: boolean) => {
    drag.current = {
      active: true,
      startY: clientY,
      startTranslate: translateFor(index),
      lastY: clientY,
      lastT: performance.now(),
      velocity: 0,
      fromContent,
    };
    setDragging(true);
  };

  const onHandlePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    // เริ่มลากก่อนเสมอ แล้วค่อยขอจับ pointer
    // เพราะ setPointerCapture โยน error ได้ ถ้าเรียกก่อนแล้วมันพัง การลากจะไม่เริ่มเลย
    beginDrag(e.clientY, false);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // จับไม่ได้ก็ยังลากได้ตราบใดที่นิ้วยังอยู่บนที่จับ
    }
  };

  /**
   * ลากในพื้นที่เนื้อหา — จะกลายเป็นการลากแผ่นก็ต่อเมื่อ
   * แผ่นยังไม่สุด หรือ เนื้อหาเลื่อนอยู่บนสุดแล้วและผู้ใช้กำลังลากลง
   */
  const onContentPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    const atTop = (scrollRef.current?.scrollTop ?? 0) <= 0;
    const atMaxSnap = index === snapPoints.length - 1;
    if (atMaxSnap && !atTop) return;
    beginDrag(e.clientY, true);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dy = e.clientY - d.startY;

    // ลากขึ้นจากในเนื้อหาทั้งที่แผ่นสุดแล้ว = ผู้ใช้ตั้งใจจะเลื่อนอ่าน ไม่ใช่ลากแผ่น
    if (d.fromContent && index === snapPoints.length - 1 && dy < 0) {
      d.active = false;
      setDragging(false);
      return;
    }

    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) {
      d.velocity = (e.clientY - d.lastY) / dt; // พิกเซลต่อมิลลิวินาที
      d.lastY = e.clientY;
      d.lastT = now;
    }

    const min = translateFor(snapPoints.length - 1);
    const max = translateFor(0);
    let next = d.startTranslate + dy;
    // ลากเลยขอบบน-ล่างได้นิดหน่อยแบบหนืด ให้รู้สึกว่ามันมีขอบจริง
    if (next < min) next = min - (min - next) * 0.35;
    if (next > max) next = max + (next - max) * 0.35;
    applyTranslate(next);
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDragging(false);

    const el = sheetRef.current;
    if (!el) return;
    const current = new DOMMatrix(getComputedStyle(el).transform).m42;

    // สะบัดเร็วพอ = ข้ามไปจุดถัดไปตามทิศทาง โดยไม่สนว่านิ้วไปถึงครึ่งทางหรือยัง
    if (Math.abs(d.velocity) > 0.55) {
      settle(index + (d.velocity > 0 ? -1 : 1));
      return;
    }

    // ไม่งั้นเลือกจุดที่ใกล้ตำแหน่งที่ปล่อยมือที่สุด
    let best = 0;
    let bestDist = Infinity;
    snapPoints.forEach((_, i) => {
      const dist = Math.abs(translateFor(i) - current);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    settle(best);
  };

  const atMaxSnap = index === snapPoints.length - 1;

  return (
    <div
      ref={sheetRef}
      className={cn(
        "absolute inset-x-0 bottom-0 top-0 z-40 flex flex-col overflow-hidden rounded-t-3xl border border-border bg-bg shadow-pop",
        !dragging && "transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      role="dialog"
      aria-label={label}
      style={{ touchAction: "none" }}
    >
      {/* ที่จับลาก — แตะแล้วยังสลับระดับได้ด้วย เผื่อคนไม่ถนัดลาก */}
      <div
        onPointerDown={onHandlePointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
      >
        <button
          type="button"
          onClick={() => settle(atMaxSnap ? 0 : index + 1)}
          aria-label={atMaxSnap ? "ย่อรายการ" : "ขยายรายการ"}
          className="flex w-full justify-center py-3"
        >
          <span className="h-1.5 w-11 rounded-full bg-border-strong" />
        </button>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={onContentPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "min-h-0 flex-1 overscroll-contain",
          atMaxSnap ? "overflow-y-auto" : "overflow-hidden",
        )}
        style={{
          touchAction: atMaxSnap ? "pan-y" : "none",
          paddingBottom: "var(--rc-sheet-clipped, 0px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
