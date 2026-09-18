import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CostCalculator } from "@/components/blog/CostCalculator";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { posts, postBySlug, type PostBlock } from "@/data/posts";
import { formatThaiDate } from "@/lib/utils";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug[slug];
  if (!post) return { title: "ไม่พบบทความ" };
  return { title: post.title, description: post.excerpt };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "h":
      return <h2 className="t-h2 mt-10 mb-3">{block.text}</h2>;
    case "p":
      return <p className="t-body mt-4 text-fg-muted">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-4 space-y-2.5">
          {block.items.map((it) => (
            <li key={it} className="flex gap-3 text-fg-muted">
              <Icon name="check" size={18} className="mt-1.5 shrink-0 text-accent" />
              <span className="t-body">{it}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside className="mt-7 rounded-panel border border-border bg-bg-subtle p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[1rem] font-bold text-fg">
            <Icon name="info" size={19} className="text-brand" />
            {block.title}
          </p>
          <p className="t-body-sm mt-2 text-fg-muted">{block.text}</p>
        </aside>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-card border border-border">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead className="bg-bg-subtle">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-3 text-[0.8125rem] text-fg">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        j === 0
                          ? "px-4 py-3 text-[0.875rem] font-bold text-fg"
                          : "px-4 py-3 text-[0.875rem] text-fg-muted"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "calculator":
      return <CostCalculator />;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug[slug];
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="pb-24 md:pb-16">
      <div className="shell max-w-3xl pt-6">
        <nav className="t-caption flex items-center gap-1.5" aria-label="เส้นทางนำทาง">
          <Link href="/blog" className="hover:text-brand">บทความ</Link>
          <Icon name="chevronRight" size={13} className="opacity-40" />
          <span className="text-fg">{post.category}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge tone="accent">{post.category}</Badge>
          <span className="t-caption">{formatThaiDate(post.date)}</span>
          <span className="t-caption">· อ่าน {post.readMin} นาที</span>
        </div>

        <h1 className="t-h1 mt-4">{post.title}</h1>
        <p className="t-body-lg mt-4 text-fg-muted">{post.excerpt}</p>
      </div>

      <div className="shell mt-8 max-w-4xl">
        <div className="relative aspect-[2/1] overflow-hidden rounded-panel bg-surface-sunken">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56rem"
            className="object-cover"
          />
        </div>
      </div>

      <article className="shell mt-10 max-w-3xl">
        {post.body ? (
          post.body.map((b, i) => <Block key={i} block={b} />)
        ) : (
          /* บทความที่ยังไม่ได้เขียนเนื้อหาเต็ม — บอกให้ชัดแทนที่จะปล่อยหน้าว่าง */
          <div className="rounded-panel border border-dashed border-border-strong bg-bg-subtle p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface text-fg-faint">
              <Icon name="book" size={24} />
            </span>
            <h2 className="t-h3 mt-4">บทความนี้ยังอยู่ระหว่างเขียน</h2>
            <p className="t-body-sm mx-auto mt-2 max-w-md text-fg-muted">
              ในต้นแบบนี้มีบทความที่เขียนเนื้อหาเต็มไว้ 3 เรื่อง
              ส่วนที่เหลือใส่ไว้เป็นโครงเพื่อให้เห็นภาพหน้ารวมบทความ
            </p>
            <ButtonLink href="/blog" variant="secondary" className="mt-6" icon="arrowLeft">
              กลับไปหน้ารวมบทความ
            </ButtonLink>
          </div>
        )}

        <div className="mt-12 rounded-panel brand-gradient-bg p-6 text-center sm:p-8">
          <h2 className="t-h3 text-white">อยากชาร์จที่บ้านได้เองไหม</h2>
          <p className="t-body-sm mx-auto mt-2 max-w-md text-white/85">
            ส่งรูปตู้ไฟและบอกรุ่นรถมาให้ทีมงานประเมินเบื้องต้นได้ฟรี
          </p>
          <ButtonLink
            href="/contact"
            variant="onColor"
            className="mt-5"
            iconRight="arrowRight"
          >
            ขอใบเสนอราคา
          </ButtonLink>
        </div>
      </article>

      <section className="shell mt-16 max-w-5xl border-t border-border pt-12">
        <h2 className="t-h2 mb-6">อ่านต่อ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {more.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col rounded-card border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <Badge tone="accent" className="self-start">{p.category}</Badge>
              <h3 className="t-h3 mt-3">{p.title}</h3>
              <p className="t-body-sm mt-2 line-clamp-2 text-fg-muted">{p.excerpt}</p>
              <span className="t-button mt-auto inline-flex items-center gap-1.5 pt-4 text-brand">
                อ่านต่อ
                <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
