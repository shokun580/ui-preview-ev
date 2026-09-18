/**
 * สร้างรูปตัวอย่างตอนแชร์ลิงก์ (Open Graph) → public/og.png
 *
 *   node scripts/build-og-image.mjs
 *
 * ทำไมไม่ใช้ตัวสร้างรูปของ Next (next/og):
 *   ตัวนั้นวาง "วรรณยุกต์ที่ซ้อนบนสระ" ของภาษาไทยไม่ได้
 *   คำว่า "ที่" ออกมาเป็น "ที" และ "ตั้ง" ออกมาเป็น "ตัง" ซึ่งอ่านผิดความหมาย
 *   จึงเปลี่ยนมาวาดด้วย rsvg-convert ที่จัดรูปอักษรไทยได้ถูกต้อง
 *
 * ผลลัพธ์เป็นไฟล์นิ่ง เก็บลง git ไปเลย ไม่ต้องสร้างตอน deploy
 * (เครื่อง deploy ไม่มี rsvg-convert) รันสคริปต์นี้ใหม่เมื่อเปลี่ยนโลโก้หรือข้อความเท่านั้น
 *
 * ต้องมี rsvg-convert ก่อน:  brew install librsvg
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const fontDir = join(root, "src/assets/fonts");
const out = join(root, "public/og.png");

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
    <text x="108" y="35" font-family="LINE Seed Sans TH" font-weight="800" font-size="27"
          letter-spacing="6.5" fill="#ffffff" fill-opacity="0.88">RECHARGER</text>
    <text x="108" y="74" font-family="LINE Seed Sans TH" font-weight="800" font-size="36"
          letter-spacing="1" fill="#2EB4E0">ENERGY</text>
  </g>

  <text x="80" y="352" font-family="LINE Seed Sans TH" font-weight="800" font-size="74" fill="#ffffff">${HEADLINE_1}</text>
  <text x="80" y="456" font-family="LINE Seed Sans TH" font-weight="800" font-size="74" fill="#4FC9A8">${HEADLINE_2}</text>

  <line x1="80" y1="520" x2="1120" y2="520" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="80" y="566" font-family="LINE Seed Sans TH" font-weight="400" font-size="26"
        fill="#ffffff" fill-opacity="0.62">${FOOTNOTE.join("   ·   ")}</text>
</svg>`;

const tmp = mkdtempSync(join(tmpdir(), "rc-og-"));
try {
  const svgPath = join(tmp, "og.svg");
  const confPath = join(tmp, "fonts.conf");
  writeFileSync(svgPath, svg);
  // ชี้ fontconfig มาที่ฟอนต์ในโปรเจกต์ จะได้ไม่ต้องไปติดตั้งฟอนต์ลงเครื่อง
  writeFileSync(
    confPath,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <dir>${fontDir}</dir>
  <cachedir>${join(tmp, "cache")}</cachedir>
</fontconfig>`,
  );

  // กันพลาดเงียบ ๆ: ถ้า fontconfig หาชื่อฟอนต์ไม่เจอ rsvg-convert จะไม่ error
  // แต่จะไปหยิบฟอนต์ไทยตัวอื่นของเครื่องมาใช้แทน (บนแมคคือ Tahoma) ซึ่งหน้าตาคนละเรื่อง
  // กับทั้งเว็บ และเราจะไม่รู้เลยจนกว่าจะเปิดรูปดูเอง จึงเช็กให้แน่ก่อนว่า resolve ถูกตัว
  const env = { ...process.env, FONTCONFIG_FILE: confPath };
  const matched = execFileSync("fc-match", ["--format=%{file}", "LINE Seed Sans TH"], {
    env,
    encoding: "utf8",
  }).trim();
  if (!/LINESeedSansTH/.test(matched)) {
    throw new Error(
      `fontconfig หา "LINE Seed Sans TH" ไม่เจอ — ได้ ${matched} มาแทน\n` +
        `ตรวจว่ามีไฟล์ .ttf ครบใน ${fontDir}\n` +
        `(fontconfig อ่าน .woff2 ไม่ได้ จึงใช้ไฟล์ชุดเดียวกับที่เว็บโหลดใน public/fonts ไม่ได้)`,
    );
  }
  console.log(`ฟอนต์ที่ใช้: ${matched}`);

  execFileSync("rsvg-convert", ["-w", "1200", "-h", "630", svgPath, "-o", out], {
    env,
    stdio: "inherit",
  });
  console.log("สร้างแล้ว: public/og.png (1200×630)");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
