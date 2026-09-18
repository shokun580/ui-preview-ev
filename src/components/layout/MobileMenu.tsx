"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "./Logo";
import { mainNav } from "./nav";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { contact } from "@/data/site";
import { cn } from "@/lib/utils";

/** เมนูเต็มจอสำหรับมือถือและแท็บเล็ต — เปิดจากปุ่มแฮมเบอร์เกอร์ */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  // ล็อกการเลื่อนหน้าหลังไว้ระหว่างเปิดเมนู และปิดด้วยปุ่ม Esc
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

  const links = [
    ...mainNav.flatMap((i) =>
      i.children ? i.children.map((c) => ({ href: c.href, label: t(c.key), icon: c.icon })) : [{ href: i.href, label: t(i.key), icon: i.icon }],
    ),
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
      style={{ animation: "rc-fade-in 180ms ease-out both" }}
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.menu")}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
        <Logo size={34} id="mm" />
        <button
          type="button"
          onClick={onClose}
          aria-label={t("nav.close")}
          className="grid h-10 w-10 place-items-center rounded-full border border-border text-fg"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-label={t("nav.menu")}>
        <ul className="space-y-1">
          {links.map((l, i) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href} style={{ animation: `rc-fade-up 320ms ease-out ${i * 45}ms both` }}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors",
                    active ? "bg-brand-soft text-brand-soft-fg" : "text-fg hover:bg-surface-hover",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      active ? "bg-brand text-white" : "bg-surface-sunken text-fg-muted",
                    )}
                  >
                    <Icon name={l.icon} size={19} />
                  </span>
                  <span className="t-h3">{l.label}</span>
                  <Icon name="chevronRight" size={18} className="ml-auto opacity-40" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 space-y-3 border-t border-border pt-6">
          <ButtonLink href="/contact" size="lg" className="w-full" iconRight="arrowRight" onClick={onClose}>
            {t("cta.quoteLong")}
          </ButtonLink>
          <a
            href={contact.phoneHref}
            className="flex items-center justify-center gap-2 rounded-full border border-border-strong py-3 text-[0.9375rem] font-bold text-fg"
          >
            <Icon name="phone" size={18} />
            {contact.phone}
          </a>
        </div>
      </nav>
    </div>
  );
}
