"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";

export type ViewBox = [number, number, number, number];

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * ลากเลื่อน / หนีบนิ้วซูม / สกรอลล์ซูมบนแผนที่ SVG
 *
 * ทั้งหมดทำงานบนค่า viewBox โดยตรง ไม่ใช้ CSS transform
 * เพราะเส้นขอบและตัวอักษรต้องคำนวณขนาดจาก viewBox อยู่แล้ว
 * ถ้าไปสเกลด้วย transform เส้นจะหนาขึ้นตามและตัวหนังสือจะเบลอ
 */
export function useMapGestures({
  svgRef,
  viewBoxRef,
  setViewBox,
  world,
  minWidth,
  maxWidth,
  wheelMode = "always",
  onWheelBlocked,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  viewBoxRef: React.RefObject<ViewBox>;
  setViewBox: (v: ViewBox) => void;
  /** ขอบเขตของ "โลก" ที่ยอมให้เลื่อนออกไปได้ [minX, minY, maxX, maxY] */
  world: [number, number, number, number];
  minWidth: number;
  maxWidth: number;
  /** always = หมุนล้อซูมได้เลย, modifier = ต้องกด Ctrl/Cmd ค้าง, off = ปิด */
  wheelMode?: "always" | "modifier" | "off";
  onWheelBlocked?: () => void;
}) {
  /** ตัวชี้ที่กำลังแตะอยู่ — หนึ่งตัวคือลาก สองตัวคือหนีบซูม */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; mid: [number, number] } | null>(null);
  const movedRef = useRef(0);
  /** true เมื่อเพิ่งลากจบ ใช้กันไม่ให้เกิดการ "คลิกเลือก" ทั้งที่ตั้งใจจะเลื่อนแผนที่ */
  const suppressClick = useRef(false);

  /** แปลงพิกัดบนหน้าจอเป็นพิกัดในระบบของ SVG */
  const toSvg = useCallback(
    (clientX: number, clientY: number): [number, number] => {
      const svg = svgRef.current;
      const vb = viewBoxRef.current;
      if (!svg) return [vb[0] + vb[2] / 2, vb[1] + vb[3] / 2];
      const r = svg.getBoundingClientRect();
      // preserveAspectRatio="xMidYMid meet" ย่อตามด้านที่คับกว่า แล้วจัดกึ่งกลาง
      const scale = Math.min(r.width / vb[2], r.height / vb[3]);
      const offX = (r.width - vb[2] * scale) / 2;
      const offY = (r.height - vb[3] * scale) / 2;
      return [
        vb[0] + (clientX - r.left - offX) / scale,
        vb[1] + (clientY - r.top - offY) / scale,
      ];
    },
    [svgRef, viewBoxRef],
  );

  const commit = useCallback(
    (next: ViewBox) => {
      const aspect = next[3] / next[2];
      const w = clamp(next[2], minWidth, maxWidth);
      const h = w * aspect;
      // ต้องให้แผนที่เหลืออยู่ในจออย่างน้อยหนึ่งในสี่ ไม่งั้นลากจนหลุดหายไปเลย
      const x = clamp(next[0], world[0] - w * 0.75, world[2] - w * 0.25);
      const y = clamp(next[1], world[1] - h * 0.75, world[3] - h * 0.25);
      setViewBox([x, y, w, h]);
    },
    [maxWidth, minWidth, setViewBox, world],
  );

  /** ซูมโดยตรึงจุดที่ระบุไว้กับที่ — นิ้วหรือเมาส์อยู่ตรงไหน ตรงนั้นต้องไม่ขยับ */
  const zoomAt = useCallback(
    (point: [number, number], factor: number) => {
      const [x, y, w, h] = viewBoxRef.current;
      const nw = clamp(w * factor, minWidth, maxWidth);
      const k = nw / w;
      commit([
        point[0] - (point[0] - x) * k,
        point[1] - (point[1] - y) * k,
        nw,
        h * k,
      ]);
    },
    [commit, maxWidth, minWidth, viewBoxRef],
  );

  const zoomCenter = useCallback(
    (factor: number) => {
      const [x, y, w, h] = viewBoxRef.current;
      zoomAt([x + w / 2, y + h / 2], factor);
    },
    [viewBoxRef, zoomAt],
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      movedRef.current = 0;
      suppressClick.current = false;

      // ตั้งใจยังไม่เรียก setPointerCapture ตรงนี้
      // เพราะเมื่อ pointer ถูกจับไว้ที่ <svg> เบราว์เซอร์จะส่ง event click
      // ไปที่ <svg> แทนที่จะเป็นรูปจังหวัดหรือฟองตัวเลขที่อยู่ข้างใน
      // ทำให้กดเลือกภาค/จังหวัดไม่ได้เลย
      // จึงไปจับเอาตอนที่ผู้ใช้เริ่มลากจริง ๆ แทน (ดูใน onPointerMove)

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchRef.current = {
          dist: Math.hypot(a.x - b.x, a.y - b.y),
          mid: toSvg((a.x + b.x) / 2, (a.y + b.y) / 2),
        };
      }
    },
    [toSvg],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // ── สองนิ้ว: หนีบซูม
      if (pointers.current.size === 2 && pinchRef.current) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 0 && pinchRef.current.dist > 0) {
          movedRef.current += Math.abs(dist - pinchRef.current.dist);
          zoomAt(pinchRef.current.mid, pinchRef.current.dist / dist);
          pinchRef.current.dist = dist;
        }
        if (movedRef.current > 6) suppressClick.current = true;
        return;
      }

      // ── นิ้วเดียว: ลากเลื่อน
      if (pointers.current.size !== 1) return;
      const dxPx = e.clientX - prev.x;
      const dyPx = e.clientY - prev.y;
      movedRef.current += Math.hypot(dxPx, dyPx);

      // ขยับน้อยกว่านี้ถือว่าเป็นการกด ไม่ใช่การลาก — ปล่อยให้ click ทำงานตามปกติ
      if (movedRef.current <= 6) return;

      if (!suppressClick.current) {
        suppressClick.current = true;
        // เริ่มลากจริงแล้วค่อยจับ pointer ไว้ จะได้ลากต่อได้แม้เมาส์เลยขอบแผนที่ไป
        try {
          (e.currentTarget as SVGSVGElement).setPointerCapture?.(e.pointerId);
        } catch {
          // จับไม่ได้ก็ยังลากได้ตราบใดที่เมาส์ยังอยู่บนแผนที่
        }
      }

      const svg = svgRef.current;
      const vb = viewBoxRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const scale = Math.min(r.width / vb[2], r.height / vb[3]);
      commit([vb[0] - dxPx / scale, vb[1] - dyPx / scale, vb[2], vb[3]]);
    },
    [commit, svgRef, viewBoxRef, zoomAt],
  );

  const onPointerUp = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
  }, []);

  const onWheel = useCallback(
    (e: ReactWheelEvent<SVGSVGElement>) => {
      if (wheelMode === "off") return;
      if (wheelMode === "modifier" && !e.ctrlKey && !e.metaKey) {
        onWheelBlocked?.();
        return;
      }
      e.preventDefault();
      // trackpad ส่งค่ามาถี่และทีละน้อย ส่วนล้อเมาส์มาทีละก้อนใหญ่
      // จำกัดช่วงไว้เพื่อให้ความเร็วซูมใกล้เคียงกันทั้งสองแบบ
      const step = clamp(e.deltaY, -60, 60);
      zoomAt(toSvg(e.clientX, e.clientY), Math.exp(step * 0.0022));
    },
    [onWheelBlocked, toSvg, wheelMode, zoomAt],
  );

  /** ครอบ handler ของการคลิกเลือก ไม่ให้ทำงานถ้าเพิ่งลากแผนที่อยู่ */
  const guardClick = useCallback(
    (fn: () => void) =>
      () => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        fn();
      },
    [],
  );

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel,
    },
    zoomCenter,
    guardClick,
  };
}
