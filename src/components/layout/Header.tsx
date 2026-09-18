"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./Toggles";
import { mainNav } from "./nav";
import { MobileMenu } from "./MobileMenu";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const dropTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // เผื่อกรณีเปิดหน้ามาแล้วเบราว์เซอร์คืนตำแหน่ง scroll เดิมให้ทันที
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ปิดเมนูทั้งหมดเมื่อเปลี่ยนหน้า — ปรับ state ระหว่างเรนเดอร์
  // เพื่อให้เมนูหายไปในเฟรมเดียวกับที่หน้าใหม่ขึ้น ไม่มีจังหวะที่เห็นเมนูค้าง
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenDrop(null);
    setOpenMenu(false);
  }

  const hoverOpen = (key: string) => {
    if (dropTimer.current) clearTimeout(dropTimer.current);
    setOpenDrop(key);
  };
  const hoverClose = () => {
    if (dropTimer.current) clearTimeout(dropTimer.current);
    // หน่วงไว้เล็กน้อยเพื่อให้เมาส์เคลื่อนจากปุ่มลงไปยังเมนูย่อยได้ทัน
    dropTimer.current = setTimeout(() => setOpenDrop(null), 140);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          // ยังไม่เลื่อน = โปร่งสนิท ให้แถบเมนูกลืนไปกับ Hero
          // พอเริ่มเลื่อนค่อยมีพื้นและเส้นขอบ เพื่อให้อ่านออกเมื่อทับเนื้อหา
          scrolled
            ? "border-b border-border bg-bg/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="shell flex h-16 items-center gap-3 lg:h-[4.5rem]">
          <Link href="/" className="shrink-0" aria-label="Recharger Energy — หน้าแรก">
            <Logo size={36} id="hdr" />
          </Link>

          {/* ── เมนูหลัก เฉพาะจอ lg ขึ้นไป ── */}
          <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="เมนูหลัก">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "t-nav relative whitespace-nowrap rounded-full px-3.5 py-2 transition-colors",
                      active ? "font-bold text-brand" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {t(item.key)}
                    {active && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand" />
                    )}
                  </Link>
                );
              }
              const dropActive =
                active || item.children.some((c) => isActive(pathname, c.href));
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => hoverOpen(item.href)}
                  onMouseLeave={hoverClose}
                >
                  <button
                    type="button"
                    aria-expanded={openDrop === item.href}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenDrop((k) => (k === item.href ? null : item.href))
                    }
                    className={cn(
                      "t-nav relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 transition-colors",
                      dropActive ? "font-bold text-brand" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {t(item.key)}
                    <Icon
                      name="chevronDown"
                      size={15}
                      className={cn(
                        "transition-transform duration-200",
                        openDrop === item.href && "rotate-180",
                      )}
                    />
                    {dropActive && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand" />
                    )}
                  </button>

                  {openDrop === item.href && (
                    <div
                      className="absolute left-0 top-full w-[21rem] pt-3"
                      style={{ animation: "rc-fade-up 180ms ease-out both" }}
                    >
                      <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-pop">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-surface-hover"
                          >
                            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-soft-fg">
                              <Icon name={c.icon} size={18} />
                            </span>
                            <span>
                              <span className="block text-[0.9375rem] text-fg">
                                {t(c.key)}
                              </span>
                              <span className="t-caption mt-0.5 block">{c.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── ฝั่งขวา ── */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {/* ครอบด้วย span แทนการใส่คลาส hidden ที่ตัวปุ่มเอง
                เพราะ .hidden กับ .inline-flex เป็น utility ของ property เดียวกัน
                ปุ่มจะไม่ถูกซ่อนจริง แล้วแถบ header จะล้นจนปุ่มเมนูหลุดออกนอกจอ */}
            <span className="hidden md:block">
              <ButtonLink href="/contact" size="sm" iconRight="arrowRight">
                {t("cta.quote")}
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setOpenMenu(true)}
              aria-label={t("nav.menu")}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-fg transition-colors hover:border-brand hover:text-brand lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={openMenu} onClose={() => setOpenMenu(false)} />
    </>
  );
}
