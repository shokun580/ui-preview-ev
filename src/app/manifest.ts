import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Web app manifest — ทำให้ "เพิ่มไปยังหน้าจอโฮม" บนมือถือได้ไอคอนและชื่อที่ถูกต้อง
 * และเปิดแบบเต็มจอไม่มีแถบที่อยู่เว็บ เข้ากับที่ออกแบบหน้าค้นหาไว้ให้เหมือนแอป
 *
 * ไอคอนใช้รุ่นที่เผื่อขอบไว้ เพราะ Android ครอบไอคอนเป็นวงกลมหรือรูปทรงอื่นตามธีมของเครื่อง
 * ถ้าใช้รุ่นเต็มกรอบ ตัวสัญลักษณ์จะโดนตัดขอบ
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: "Recharger",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#060f18",
    theme_color: "#0FA3CE",
    lang: "th",
    orientation: "portrait",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
