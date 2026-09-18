/**
 * ข้อมูลภูมิศาสตร์สำหรับแผนที่
 *
 * รูปร่างจังหวัดมาจากขอบเขตการปกครองจริงทั้ง 77 จังหวัด (ดู thailand-geo.ts
 * ซึ่งสร้างด้วย scripts/build-thailand-geo.mjs) ไฟล์นี้ทำหน้าที่ประกอบข้อมูลนั้น
 * เข้ากับเรื่องที่เว็บต้องใช้ — การแบ่งภาค พิกัดตัวเมือง และกรอบมุมมองของแต่ละภาค
 */

import {
  MAP_H,
  MAP_W,
  project,
  provinceShapes,
  type ProvinceShape,
  type RegionId,
} from "./thailand-geo";

export { MAP_H, MAP_W, project, provinceShapes };
export type { ProvinceShape, RegionId };

export type Region = {
  id: RegionId;
  name: string;
  /** ชื่อสั้นสำหรับป้ายบนแผนที่ — ชื่อเต็มยาวเกินจนล้นออกนอกรูปภาค */
  short: string;
  nameEn: string;
};

export const regions: Region[] = [
  { id: "north", name: "ภาคเหนือ", short: "เหนือ", nameEn: "Northern" },
  { id: "northeast", name: "ภาคตะวันออกเฉียงเหนือ", short: "อีสาน", nameEn: "Northeastern" },
  { id: "central", name: "ภาคกลาง", short: "กลาง", nameEn: "Central" },
  { id: "east", name: "ภาคตะวันออก", short: "ตะวันออก", nameEn: "Eastern" },
  { id: "west", name: "ภาคตะวันตก", short: "ตะวันตก", nameEn: "Western" },
  { id: "south", name: "ภาคใต้", short: "ใต้", nameEn: "Southern" },
];

export const regionById = Object.fromEntries(
  regions.map((r) => [r.id, r]),
) as Record<RegionId, Region>;

export const shapeById = Object.fromEntries(
  provinceShapes.map((p) => [p.id, p]),
) as Record<string, ProvinceShape>;

export function shapesInRegion(region: RegionId) {
  return provinceShapes.filter((p) => p.region === region);
}

/** กรอบสี่เหลี่ยมของภาค — รวมกรอบของทุกจังหวัดในภาคนั้น ใช้คำนวณระยะซูม */
const regionBoxCache = new Map<RegionId, { minX: number; minY: number; width: number; height: number }>();

export function regionBBox(id: RegionId) {
  const cached = regionBoxCache.get(id);
  if (cached) return cached;

  const members = shapesInRegion(id);
  const minX = Math.min(...members.map((p) => p.bbox[0]));
  const minY = Math.min(...members.map((p) => p.bbox[1]));
  const maxX = Math.max(...members.map((p) => p.bbox[2]));
  const maxY = Math.max(...members.map((p) => p.bbox[3]));
  const box = { minX, minY, width: maxX - minX, height: maxY - minY };
  regionBoxCache.set(id, box);
  return box;
}

/**
 * พิกัดตัวเมืองของจังหวัดที่มีสถานีในระบบ
 * ใช้วางหมุดให้ตรงตำแหน่งตัวเมืองจริง ซึ่งมักไม่ใช่จุดกึ่งกลางทางเรขาคณิตของจังหวัด
 * (เช่น ตัวเมืองประจวบฯ อยู่ค่อนไปทางเหนือมากเมื่อเทียบกับรูปร่างจังหวัด)
 */
const cityCoords: Record<string, [number, number]> = {
  "chiang-mai": [18.788, 98.985],
  "chiang-rai": [19.908, 99.831],
  lampang: [18.288, 99.491],
  nan: [18.783, 100.779],
  "mae-hong-son": [19.301, 97.968],
  "nakhon-ratchasima": [14.979, 102.098],
  "khon-kaen": [16.441, 102.836],
  "udon-thani": [17.415, 102.786],
  "ubon-ratchathani": [15.238, 104.848],
  "nong-khai": [17.879, 102.742],
  buriram: [14.994, 103.103],
  bangkok: [13.756, 100.502],
  nonthaburi: [13.859, 100.514],
  "pathum-thani": [14.021, 100.525],
  ayutthaya: [14.353, 100.578],
  saraburi: [14.528, 100.911],
  "nakhon-sawan": [15.704, 100.137],
  phitsanulok: [16.823, 100.259],
  "samut-prakan": [13.599, 100.597],
  kanchanaburi: [14.022, 99.532],
  ratchaburi: [13.528, 99.813],
  phetchaburi: [13.111, 99.94],
  prachuap: [11.812, 99.798],
  tak: [16.884, 99.126],
  chonburi: [13.362, 100.985],
  rayong: [12.681, 101.277],
  chanthaburi: [12.611, 102.104],
  trat: [12.243, 102.515],
  chachoengsao: [13.69, 101.071],
  phuket: [7.88, 98.392],
  "surat-thani": [9.139, 99.321],
  "nakhon-si": [8.432, 99.966],
  songkhla: [7.199, 100.595],
  krabi: [8.086, 98.906],
  chumphon: [10.494, 99.18],
};

export type Province = {
  id: string;
  name: string;
  nameEn: string;
  region: RegionId;
  lat: number;
  lng: number;
  /** ตำแหน่งวางหมุดในระบบพิกัดของ SVG */
  pin: [number, number];
};

function unproject(x: number, y: number): [number, number] {
  // ใช้เฉพาะกับจังหวัดที่ยังไม่ได้ใส่พิกัดตัวเมือง — คืนค่าใกล้เคียงจากจุดกึ่งกลางรูปร่าง
  const { minLng, maxLat, kx, scale } = PROJECTION_CONSTANTS;
  return [maxLat - y / scale, minLng + x / (kx * scale)];
}

import { PROJECTION as PROJECTION_CONSTANTS } from "./thailand-geo";

export const provinces: Province[] = provinceShapes.map((s) => {
  const city = cityCoords[s.id];
  if (city) {
    const [lat, lng] = city;
    return { ...s, lat, lng, pin: project(lng, lat) };
  }
  const [lat, lng] = unproject(s.label[0], s.label[1]);
  return { ...s, lat, lng, pin: s.label };
});

export const provinceById = Object.fromEntries(
  provinces.map((p) => [p.id, p]),
) as Record<string, Province>;

export function provincesInRegion(region: RegionId) {
  return provinces.filter((p) => p.region === region);
}
