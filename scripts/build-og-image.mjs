/**
 * สร้างรูปตัวอย่างตอนแชร์ลิงก์ (Open Graph) → public/og.png
 *
 *   node scripts/build-og-image.mjs
 *
 * ต้องเตรียมเครื่องก่อน 2 อย่าง:
 *   brew install librsvg
 *   cp src/assets/fonts/*.ttf ~/Library/Fonts/ && fc-cache -f
 *
 * ทำไมไม่ใช้ตัวสร้างรูปของ Next (next/og):
 *   ตัวนั้นวาง "วรรณยุกต์ที่ซ้อนบนสระ" ของภาษาไทยไม่ได้
 *   คำว่า "ที่" ออกมาเป็น "ที" และ "ตั้ง" ออกมาเป็น "ตัง" ซึ่งอ่านผิดความหมาย
 *   จึงเปลี่ยนมาวาดด้วย rsvg-convert ที่จัดรูปอักษรไทยได้ถูกต้อง
 *
 * ทำไมต้องติดตั้งฟอนต์ลงเครื่อง:
 *   rsvg-convert บน macOS "ไม่สนใจ" ตัวแปร FONTCONFIG_FILE
 *   (ทดสอบแล้ว: ชี้ไปโฟลเดอร์ที่ไม่มีฟอนต์เลย มันก็ยังวาดไทยออกมาได้เหมือนเดิมเป๊ะ)
 *   จะชี้ให้มันอ่านฟอนต์จากในโปรเจกต์โดยตรงไม่ได้ ต้องให้ฟอนต์อยู่ในระบบเท่านั้น
 *   โค้ดข้างล่างจึงมีด่านตรวจไว้ กันไม่ให้สร้างรูปด้วยฟอนต์ผิดโดยไม่รู้ตัว
 *
 * ผลลัพธ์เป็นไฟล์นิ่ง เก็บลง git ไปเลย ไม่ต้องสร้างตอน deploy
 * (เครื่อง deploy ไม่มี rsvg-convert) รันสคริปต์นี้ใหม่เมื่อเปลี่ยนโลโก้หรือข้อความเท่านั้น
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const fontDir = join(root, "src/assets/fonts");
const out = join(root, "public/og.png");
const version = join(root, "src/data/og.ts");

const FONT = "LINE Seed Sans TH";

const HEADLINE_1 = "ชาร์จที่ไหนก็ได้";
const HEADLINE_2 = "ติดตั้งที่บ้านคุณก็ได้";
/* กฎของข้อความในรูปนี้ — รูปเป็นไฟล์นิ่งที่ถูกแคชไว้ตามแอปแชตต่าง ๆ
   แก้แล้วกว่าจะอัปเดตตามกันหมดใช้เวลาเป็นวัน บางที่ไม่อัปเดตเลย จึงใส่ได้เฉพาะ:
     ✓ ชื่อแบรนด์ สโลแกน และคำอธิบายว่าเว็บนี้ทำอะไร  (ของพวกนี้ไม่เปลี่ยน)
     ✗ ตัวเลขทุกชนิด เช่น จำนวนสถานี จำนวนจังหวัด จำนวนผลงาน  (เพิ่มลดได้ตลอด)
     ✗ คำสัญญาทางธุรกิจที่ยังไม่ได้ยืนยันกับลูกค้า เช่น ราคา หรือเงื่อนไขบริการ */
const FOOTNOTE = [
  "สถานีชาร์จทั่วประเทศไทย",
  "รับติดตั้งบ้านและธุรกิจ",
  "คู่มือใช้งานสำหรับมือใหม่",
];

const bolt = "M38 14 21 35h9.5L27 51l17-22h-9.5z";
const ring = "M43.5 17.5A20 20 0 1 1 17.5 24";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="mark" x1="6" y1="58" x2="58" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4FC9A8"/><stop offset="1" stop-color="#0FA3CE"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#4FC9A8" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#4FC9A8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0FA3CE" stop-opacity="0.36"/>
      <stop offset="1" stop-color="#0FA3CE" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0 0 0 0 64" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#060f18"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="170" cy="60" rx="470" ry="420" fill="url(#glowA)"/>
  <ellipse cx="1080" cy="600" rx="520" ry="460" fill="url(#glowB)"/>

  <g transform="translate(80 74)">
    <g transform="scale(1.32)">
      <rect width="64" height="64" rx="15" fill="url(#mark)"/>
      <path d="${ring}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".62"/>
      <path d="${bolt}" fill="#fff"/>
    </g>
    <text x="108" y="35" font-family="${FONT}" font-weight="800" font-size="27"
          letter-spacing="6.5" fill="#ffffff" fill-opacity="0.88">RECHARGER</text>
    <text x="108" y="74" font-family="${FONT}" font-weight="800" font-size="36"
          letter-spacing="1" fill="#2EB4E0">ENERGY</text>
  </g>

  <text x="80" y="352" font-family="${FONT}" font-weight="800" font-size="74" fill="#ffffff">${HEADLINE_1}</text>
  <text x="80" y="456" font-family="${FONT}" font-weight="800" font-size="74" fill="#4FC9A8">${HEADLINE_2}</text>

  <line x1="80" y1="520" x2="1120" y2="520" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="80" y="566" font-family="${FONT}" font-weight="400" font-size="26"
        fill="#ffffff" fill-opacity="0.62">${FOOTNOTE.join("   ·   ")}</text>
</svg>`;

const tmp = mkdtempSync(join(tmpdir(), "rc-og-"));
const render = (source, target) => {
  const svgPath = join(tmp, `${target}.svg`);
  const pngPath = join(tmp, `${target}.png`);
  writeFileSync(svgPath, source);
  execFileSync("rsvg-convert", ["-w", "1200", "-h", "630", svgPath, "-o", pngPath], {
    stdio: "inherit",
  });
  return pngPath;
};

try {
  /* ด่านตรวจฟอนต์ — เทียบผลวาดของ "ชื่อฟอนต์จริง" กับ "ชื่อฟอนต์ที่ไม่มีอยู่จริง"
     ถ้าได้ภาพเหมือนกันเป๊ะ แปลว่าชื่อจริงก็ถูก fallback เหมือนกัน คือยังไม่ได้ติดตั้ง
     เช็กจากผลลัพธ์แบบนี้เพราะพึ่ง fc-match ไม่ได้ — fc-match ตอบถูกได้ทั้งที่ rsvg ใช้ฟอนต์อื่น */
  const probe = (family) =>
    createHash("sha1")
      .update(
        readFileSync(
          render(
            `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><text x="20" y="100" font-family="${family}" font-weight="800" font-size="74">${HEADLINE_1}</text></svg>`,
            family === FONT ? "probe-real" : "probe-missing",
          ),
        ),
      )
      .digest("hex");

  if (probe(FONT) === probe("__rc_font_not_installed__")) {
    throw new Error(
      `rsvg-convert หา "${FONT}" ในเครื่องไม่เจอ กำลังจะวาดด้วยฟอนต์ไทยของ macOS แทน\n\n` +
        `ติดตั้งก่อนแล้วรันใหม่:\n` +
        `  cp ${fontDir}/*.ttf ~/Library/Fonts/ && fc-cache -f\n`,
    );
  }

  const bytes = readFileSync(render(svg, "og"));
  writeFileSync(out, bytes);

  /* LINE / Facebook / X / Slack แคชข้อมูล OG ไว้ตาม "URL" ไม่ได้ดูว่าไฟล์เปลี่ยนไหม
     ทับไฟล์เดิมที่ path เดิมจึงไม่มีผล ปลายทางยังโชว์รูปเก่าต่อไปอีกหลายวัน
     (เจอมาแล้วตอนแก้ฟอนต์: ไฟล์บนเซิร์ฟเวอร์ถูกแล้ว แต่ LINE ยังโชว์ของเก่า)
     จึงต่อท้าย URL ด้วยแฮชของเนื้อไฟล์ พอรูปเปลี่ยน URL ก็เปลี่ยนตาม
     เขียนเป็นไฟล์ให้ layout.tsx อ่าน จะได้ไม่ต้องมาจำแก้เลขเวอร์ชันเองทุกครั้ง */
  const hash = createHash("md5").update(bytes).digest("hex").slice(0, 8);
  writeFileSync(
    version,
    `/* สร้างอัตโนมัติจาก scripts/build-og-image.mjs — อย่าแก้ด้วยมือ */\n` +
      `export const OG_IMAGE = "/og.png?v=${hash}";\n`,
  );

  console.log(`สร้างแล้ว: public/og.png (1200×630) — ฟอนต์ถูกต้อง, v=${hash}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
