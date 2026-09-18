"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-panel border border-border bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover sm:px-6 sm:py-5"
            >
              <span className="flex-1 text-[1rem] font-bold text-fg">{item.q}</span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-200",
                  isOpen
                    ? "rotate-180 border-brand bg-brand-soft text-brand"
                    : "border-border text-fg-muted",
                )}
              >
                <Icon name="chevronDown" size={16} />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="t-body px-5 pb-5 text-fg-muted sm:px-6 sm:pb-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
