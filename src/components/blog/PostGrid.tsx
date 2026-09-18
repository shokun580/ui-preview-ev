"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { posts, postCategories } from "@/data/posts";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn, formatThaiDate } from "@/lib/utils";

export function PostGrid() {
  const [category, setCategory] = useState<string | null>(null);
  const list = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            "rounded-full border px-4 py-2 text-[0.8125rem] transition-colors",
            category === null
              ? "border-brand bg-brand-soft text-brand-soft-fg"
              : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
          )}
        >
          ทั้งหมด ({posts.length})
        </button>
        {postCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.8125rem] transition-colors",
              category === c
                ? "border-brand bg-brand-soft text-brand-soft-fg"
                : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
            )}
          >
            {c} ({posts.filter((p) => p.category === c).length})
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 3) * 80}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-sunken">
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!post.body && (
                  <span className="absolute right-3 top-3">
                    <Badge tone="neutral" className="bg-surface/95 backdrop-blur">
                      เร็ว ๆ นี้
                    </Badge>
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <Badge tone="accent">{post.category}</Badge>
                  <span className="t-caption">อ่าน {post.readMin} นาที</span>
                </div>
                <h2 className="t-h3 mt-3">{post.title}</h2>
                <p className="t-body-sm mt-2 line-clamp-3 text-fg-muted">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="t-caption">{formatThaiDate(post.date)}</span>
                  <span className="t-button inline-flex items-center gap-1.5 text-brand">
                    อ่านต่อ
                    <Icon
                      name="arrowRight"
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
