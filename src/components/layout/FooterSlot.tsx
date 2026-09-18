"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * หน้าค้นหาสถานีเป็นหน้าจอเดียวจบ สูงเท่าหน้าจอพอดี ไม่มีอะไรให้เลื่อนลง
 * การมี footer ต่อท้ายทำให้เกิดแถบเลื่อนโดยไม่จำเป็น และทำให้การหมุนล้อ
 * กลายเป็นการเลื่อนหน้าแทนที่จะเป็นการซูมแผนที่ จึงซ่อน footer เฉพาะหน้านั้น
 *
 * ส่วนหน้ารายละเอียดสถานี (/stations/[id]) เป็นหน้าเนื้อหาปกติ จึงยังมี footer
 */
export function FooterSlot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMapScreen = pathname === "/stations";

  if (isMapScreen) return null;

  return <div className="hidden md:block">{children}</div>;
}
