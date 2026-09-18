import localFont from "next/font/local";

/**
 * LINE Seed Sans TH — ฟอนต์หลักของทั้งเว็บ (ข้อกำหนดแบรนด์ ห้ามใช้ฟอนต์ไทยอื่นแทน)
 * ไฟล์ WOFF2 อยู่ใน /public/fonts (โหลดจากเครื่อง ไม่พึ่ง CDN)
 *
 * น้ำหนักที่มีจริง: 300 / 400 / 700 / 800 / 900
 * → ในดีไซน์จึงใช้เฉพาะ 400 (body), 700 (bold), 800 (heading), 900 (display)
 *   หลีกเลี่ยง 500/600 เพราะไม่มีไฟล์จริงและเบราว์เซอร์จะ fallback ลงมาเป็น 400
 */
export const lineSeed = localFont({
  src: [
    { path: "../../public/fonts/LINESeedSansTH_W_Th.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/LINESeedSansTH_W_Rg.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/LINESeedSansTH_W_Bd.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/LINESeedSansTH_W_XBd.woff2", weight: "800", style: "normal" },
    { path: "../../public/fonts/LINESeedSansTH_W_He.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  variable: "--font-line-seed",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
