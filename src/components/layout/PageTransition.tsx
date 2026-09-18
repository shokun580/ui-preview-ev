"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** เปลี่ยนหน้าแล้วค่อย ๆ จางเข้า 200ms — สั้นพอที่จะไม่รู้สึกว่าเว็บช้า */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="rc-page-enter">
      {children}
    </div>
  );
}
