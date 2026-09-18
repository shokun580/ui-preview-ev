/**
 * ดาวน์โหลดไอคอนทางการของแอปชาร์จแต่ละเจ้า
 *
 *   node scripts/fetch-app-logos.mjs
 *
 * ใช้ iTunes Search API ของ Apple เป็นแหล่งข้อมูล เพราะบริการเหล่านี้เป็นแอปมือถือ
 * ไอคอนแอปจึงเป็นโลโก้ทางการที่เจ้าของแบรนด์เผยแพร่เอง และได้ความละเอียด 512px
 *
 * ⚠️ โลโก้ทุกอันเป็นเครื่องหมายการค้าของเจ้าของแบรนด์
 *    การนำมาแสดงในหน้ารวมข้อมูลถือเป็นการอ้างถึงตามปกติ
 *    แต่ควรแจ้งหรือขออนุญาตเจ้าของแบรนด์ก่อนเผยแพร่จริง
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

/** ระบุทั้งชื่อแอปและชื่อผู้เผยแพร่ เพื่อไม่ให้หยิบแอปชื่อคล้ายกันของเจ้าอื่นมาผิด */
const APPS = [
  { id: "ev-station-pluz", term: "EV Station PluZ", seller: "PTT OIL AND RETAIL" },
  { id: "ea-anywhere", term: "E@ Anywhere", seller: "Online Asset" },
  { id: "pea-volta", term: "PEA VOLTA", seller: "PROVINCIAL ELECTRICITY" },
  { id: "mea-ev", term: "MEA EV", seller: "METROPOLITAN ELECTRICITY" },
  { id: "elexa", term: "EleXA", seller: "Electricity Generating Authority" },
  { id: "sharge", term: "Recharge - EV Charging", seller: "Sharge Management" },
  { id: "evolt", term: "EVolt", seller: "Evolt Technology Company Limited" },
  { id: "igreen", term: "iGreen+", seller: "Shenzhen CS Energy" },
  { id: "spark", term: "SPARK EV Charging", seller: "SPARK EV COMPANY" },
  { id: "plugshare", term: "PlugShare", seller: "PlugShare LLC" },
];

const OUT = new URL("../public/brand/apps/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const report = [];

for (const app of APPS) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(app.term)}&country=th&entity=software&limit=8`;
  const json = await (await fetch(url, { signal: AbortSignal.timeout(20000) })).json();

  const hit = (json.results ?? []).find((r) =>
    r.sellerName?.toLowerCase().includes(app.seller.toLowerCase()),
  );

  if (!hit) {
    report.push([app.id, "ไม่พบ", "-"]);
    continue;
  }

  const art = hit.artworkUrl512 ?? hit.artworkUrl100;
  const buf = Buffer.from(
    await (await fetch(art, { signal: AbortSignal.timeout(20000) })).arrayBuffer(),
  );
  const file = new URL(`${app.id}.png`, OUT);
  writeFileSync(file, buf);

  // ย่อเหลือ 128px — หน้าเว็บแสดงใหญ่สุดราว 48px จึงไม่ต้องเก็บไฟล์ 512px ไว้ให้หนัก
  try {
    execFileSync("sips", ["-Z", "128", file.pathname, "--out", file.pathname], {
      stdio: "ignore",
    });
  } catch {
    // ไม่มี sips ก็ใช้ไฟล์ขนาดเต็มไปก่อน
  }

  report.push([app.id, hit.trackName, hit.sellerName]);
}

console.log("ไอคอนที่ได้:");
for (const [id, name, seller] of report) {
  console.log(`  ${id.padEnd(18)} ${String(name).padEnd(34)} ${seller}`);
}
