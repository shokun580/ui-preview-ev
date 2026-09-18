"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Dot = {
  /** ตำแหน่งตั้งต้นบนตาราง */
  ox: number;
  oy: number;
  /** ระดับการตื่นตัว 0–1 ค่อย ๆ ไต่ขึ้นและค่อย ๆ จางลง */
  a: number;
};

type Ripple = { x: number; y: number; t: number };

const SPACING = 44;
/** รัศมีที่เมาส์ส่งผลถึงจุด */
const REACH = 190;
/** ระยะที่จุดถูกผลักออกมากที่สุด */
const PUSH = 8;
/** ความเร็วเมาส์ที่ถือว่า "ปัด" แรงพอจะเกิดคลื่น (พิกเซลต่อเฟรม) */
const SWEEP_SPEED = 38;

/**
 * ตารางจุดที่ตอบสนองเมาส์ วางทับพื้นหลังลายตารางของแถบหัวหน้า
 *
 * สิ่งที่เกิดขึ้น:
 *   • จุดที่อยู่ใกล้เมาส์จะสว่างขึ้น โตขึ้น และถูกผลักออกจากเมาส์เล็กน้อย
 *   • จุดที่ตื่นตัวพร้อมกันและอยู่ติดกันบนตาราง จะมีเส้นเชื่อมจาง ๆ เกิดขึ้นเอง
 *     กลายเป็นร่างแหเฉพาะรอบ ๆ เมาส์ ไม่ใช่ลากเส้นรกทั้งจอ
 *   • ปัดเมาส์เร็ว ๆ จะเกิดคลื่นวงกลมวิ่งออกไปปลุกจุดที่มันผ่าน
 *
 * ตั้งใจคุมความแรงไว้: สีมาจาก token ของแบรนด์ ไม่ใช่สีนีออน
 * ระยะผลักแค่ไม่กี่พิกเซล และไม่มีป้ายตัวเลขแบบหน้าจอเกม
 * เพราะบรีฟระบุว่าต้องการความรู้สึกล้ำแต่ไม่ใช่ไซไฟ
 *
 * ประสิทธิภาพ: วาดด้วย canvas ตัวเดียว หยุด loop เมื่อทุกจุดจางหมดแล้ว
 * และหยุดทั้งหมดเมื่อแถบนี้เลื่อนพ้นจอ
 */
export function InteractiveGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // อุปกรณ์สัมผัสไม่มีการชี้เมาส์ค้าง เอฟเฟกต์นี้จึงไม่มีประโยชน์และเปลืองแบตเปล่า ๆ
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let dots: Dot[] = [];
    let cols = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = { x: -9999, y: -9999, inside: false, px: -9999, py: -9999 };
    /* เก็บกรอบของแถบไว้ แล้วอัปเดตตอนเลื่อนหน้า/เปลี่ยนขนาดเท่านั้น
       ถ้าไปเรียก getBoundingClientRect ทุกครั้งที่เมาส์ขยับ
       เบราว์เซอร์จะต้องคำนวณเลย์เอาต์ใหม่ทั้งหน้าเป็นร้อยครั้งต่อวินาที */
    let rect = { left: 0, top: 0, width: 0, height: 0 };
    let ripples: Ripple[] = [];
    let raf = 0;
    let running = false;
    let visible = true;

    /* ── สีอ่านจาก token ของธีม แล้วอ่านใหม่เมื่อสลับโหมดสว่าง/มืด ── */
    let baseColor = "0,0,0";
    let brandColor = "15,163,206";

    const toRgb = (value: string) => {
      const probe = document.createElement("span");
      probe.style.color = value;
      probe.style.display = "none";
      document.body.appendChild(probe);
      const rgb = getComputedStyle(probe).color;
      probe.remove();
      const m = rgb.match(/\d+(\.\d+)?/g);
      return m ? `${m[0]},${m[1]},${m[2]}` : "0,0,0";
    };

    const readColors = () => {
      const cs = getComputedStyle(host);
      baseColor = toRgb(cs.getPropertyValue("--fg").trim() || "#000");
      brandColor = toRgb(cs.getPropertyValue("--brand").trim() || "#0FA3CE");
    };

    const syncRect = () => {
      const r = host.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    };

    const build = () => {
      syncRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ ox: c * SPACING, oy: r * SPACING, a: 0 });
        }
      }
    };

    /** ระดับการตื่นตัวเป้าหมายของจุดหนึ่ง ๆ จากเมาส์และจากคลื่น */
    const targetFor = (d: Dot, now: number) => {
      let t = 0;
      if (pointer.inside) {
        const dist = Math.hypot(d.ox - pointer.x, d.oy - pointer.y);
        if (dist < REACH) t = 1 - dist / REACH;
      }
      for (const rp of ripples) {
        const age = (now - rp.t) / 1000;
        const radius = age * 780;
        const dist = Math.abs(Math.hypot(d.ox - rp.x, d.oy - rp.y) - radius);
        if (dist < 70) {
          const strength = (1 - dist / 70) * Math.max(0, 1 - age / 0.75);
          if (strength > t) t = strength;
        }
      }
      return t;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      ripples = ripples.filter((rp) => now - rp.t < 750);

      let awake = false;
      const px: number[] = [];
      const py: number[] = [];

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const target = targetFor(d, now);
        // ไต่ขึ้นเร็ว จางลงช้า ให้ความรู้สึกว่ามีแรงเฉื่อย ไม่ใช่เปิด-ปิดแข็ง ๆ
        d.a += (target - d.a) * (target > d.a ? 0.3 : 0.075);
        if (d.a > 0.004) awake = true;

        let x = d.ox;
        let y = d.oy;
        if (d.a > 0.01 && pointer.inside) {
          const dx = d.ox - pointer.x;
          const dy = d.oy - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const push = PUSH * d.a * d.a;
          x += (dx / dist) * push;
          y += (dy / dist) * push;
        }
        px[i] = x;
        py[i] = y;
      }

      // ── เส้นเชื่อมระหว่างจุดที่ตื่นตัวและอยู่ติดกัน
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a1 = dots[i].a;
        if (a1 < 0.16) continue;
        const col = i % cols;
        const right = col < cols - 1 ? i + 1 : -1;
        const down = i + cols < dots.length ? i + cols : -1;
        for (const j of [right, down]) {
          if (j < 0) continue;
          const a2 = dots[j].a;
          if (a2 < 0.16) continue;
          ctx.strokeStyle = `rgba(${brandColor},${(a1 * a2 * 0.45).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }

      // ── ตัวจุด
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i].a;
        const radius = 1.2 + a * 2.2;
        ctx.beginPath();
        ctx.arc(px[i], py[i], radius, 0, Math.PI * 2);
        ctx.fillStyle =
          a < 0.02
            ? `rgba(${baseColor},0.16)`
            : `rgba(${brandColor},${(0.2 + a * 0.75).toFixed(3)})`;
        ctx.fill();
      }

      if (awake || pointer.inside || ripples.length) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      if (inside && pointer.inside) {
        const speed = Math.hypot(x - pointer.px, y - pointer.py);
        // ปัดเร็วพอ และไม่ให้ถี่เกินไป จึงจะปล่อยคลื่นออกมา
        if (speed > SWEEP_SPEED && (!ripples.length || performance.now() - ripples[ripples.length - 1].t > 140)) {
          ripples.push({ x, y, t: performance.now() });
          if (ripples.length > 4) ripples.shift();
        }
      }

      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.inside = inside;
      wake();
    };

    const onLeave = () => {
      pointer.inside = false;
      wake();
    };

    readColors();
    build();
    // วาดหนึ่งเฟรมให้เห็นจุดตั้งต้นทันที ไม่ต้องรอให้ขยับเมาส์ก่อน
    raf = requestAnimationFrame(draw);
    running = true;

    const ro = new ResizeObserver(() => {
      build();
      wake();
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const themeObserver = new MutationObserver(() => {
      readColors();
      wake();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        syncRect();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
