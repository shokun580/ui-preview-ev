import type { Metadata } from "next";
import { PostGrid } from "@/components/blog/PostGrid";

export const metadata: Metadata = {
  title: "บทความเรื่อง EV",
  description:
    "บทความเจาะลึกเรื่องการชาร์จรถ EV — หัวชาร์จแต่ละแบบ ความต่างของ AC กับ DC การคำนวณค่าชาร์จ และคำถามที่มือใหม่ถามบ่อย",
};

export default function BlogPage() {
  return (
    <div className="pb-24 md:pb-16">
      <section className="border-b border-border bg-bg-subtle py-14 sm:py-16">
        <div className="shell max-w-3xl">
          <p className="t-overline text-brand">บทความ</p>
          <h1 className="t-h1 mt-3">เรื่องน่ารู้เกี่ยวกับรถ EV และการชาร์จ</h1>
          <p className="t-body-lg mt-4 text-fg-muted">
            รวมเรื่องที่คนใช้รถไฟฟ้าถามกันบ่อยที่สุด เขียนให้อ่านจบได้ในไม่กี่นาที
            และใช้ตัดสินใจได้จริง
          </p>
        </div>
      </section>

      <section className="bg-bg py-12 sm:py-16">
        <div className="shell">
          <PostGrid />
        </div>
      </section>
    </div>
  );
}
