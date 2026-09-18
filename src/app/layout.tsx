import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { lineSeed } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterSlot } from "@/components/layout/FooterSlot";
import { BottomTab } from "@/components/layout/BottomTab";
import { PageTransition } from "@/components/layout/PageTransition";
import { OG_IMAGE } from "@/data/og";
import { site } from "@/data/site";
import "./globals.css";

/**
 * ที่อยู่เว็บจริง — ใช้ทำลิงก์แบบเต็มให้ og:image ซึ่งต้องเป็น URL เต็มเท่านั้น
 * ถ้าเป็นลิงก์แบบย่อ แอปแชตจะดึงรูปไม่ได้
 *
 * ไล่ลำดับสามชั้น:
 *   1. NEXT_PUBLIC_SITE_URL   โดเมนจริงที่ตั้งเอง — ใช้เมื่อซื้อโดเมนแล้ว
 *   2. VERCEL_PROJECT_PRODUCTION_URL   Vercel ใส่ให้เองตอน build ไม่ต้องตั้งค่าอะไร
 *   3. localhost              ตอนพัฒนาในเครื่อง
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: siteUrl,
    /* รูปนิ่งที่สร้างด้วย scripts/build-og-image.mjs
       ไม่ได้ใช้ตัวสร้างรูปของ Next เพราะมันวางวรรณยุกต์ที่ซ้อนบนสระของภาษาไทยไม่ได้
       คำว่า "ที่" จะกลายเป็น "ที" และ "ตั้ง" จะกลายเป็น "ตัง"

       OG_IMAGE มีแฮชของเนื้อไฟล์ต่อท้าย เพราะแอปแชตแคชรูปตาม URL
       ถ้าใช้ /og.png เฉย ๆ แล้วทับไฟล์เดิม ปลายทางจะยังโชว์รูปเก่าต่อไปอีกหลายวัน */
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    // ให้ขึ้นเป็นรูปใหญ่เต็มความกว้าง ไม่ใช่รูปย่อเล็ก ๆ ข้างข้อความ
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  /* ค่าเริ่มต้นของเว็บคือโหมดมืด ไม่ได้ตามการตั้งค่าเครื่อง
     จึงตั้งสีแถบเบราว์เซอร์เป็นโทนมืดไว้ก่อน
     แล้วให้ toggleTheme() แก้ค่านี้เองตอนผู้ใช้กดสลับเป็นโหมดสว่าง */
  themeColor: "#060f18",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* ตั้งธีมก่อนหน้าจอวาดครั้งแรก เพื่อไม่ให้จอขาวแวบตอนเข้าเว็บในโหมดมืด */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${lineSeed.variable} antialiased`}>
        <I18nProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:font-bold focus:text-white"
            >
              ข้ามไปยังเนื้อหาหลัก
            </a>
            <Header />
            <main id="main" className="min-h-[60vh]">
              <PageTransition>{children}</PageTransition>
            </main>
            {/* บนมือถือไม่แสดง footer — ให้หน้าจบที่เนื้อหาแล้วมีแถบเมนูลอยอยู่ด้านล่าง
                เหมือนแอปจริง ข้อมูลติดต่อทั้งหมดอยู่ที่หน้า /contact อยู่แล้ว
                และหน้าแผนที่ก็ไม่มี footer ทั้งบนคอมและมือถือ (ดูใน FooterSlot) */}
            <FooterSlot>
              <Footer />
            </FooterSlot>
            <BottomTab />
        </I18nProvider>
      </body>
    </html>
  );
}
