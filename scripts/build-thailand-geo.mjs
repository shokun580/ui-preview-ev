/**
 * สร้าง src/data/thailand-geo.ts จากขอบเขตจังหวัดจริง
 *
 *   node scripts/build-thailand-geo.mjs
 *
 * แหล่งข้อมูล: https://github.com/apisit/thailand.json (GeoJSON ขอบเขต 77 จังหวัด)
 *
 * สิ่งที่สคริปต์ทำ:
 *   1. ดาวน์โหลด GeoJSON แล้วจับคู่ชื่ออังกฤษกับชื่อไทยและภาค
 *   2. ฉายพิกัด lng/lat ลงระนาบแบบ equirectangular (ชดเชยตามละติจูดกลางของประเทศ)
 *   3. ลดจำนวนจุดด้วย Ramer–Douglas–Peucker โดยวัดระยะเป็นพิกเซลบนแผนที่
 *      จึงคุมความละเอียดได้ตรงกับที่ตาเห็นจริง
 *   4. ตัดเกาะเล็กที่เล็กเกินกว่าจะมองเห็น เพื่อไม่ให้ไฟล์บวมโดยเปล่าประโยชน์
 */

import { writeFileSync } from "node:fs";

const SOURCE =
  "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

/** ความคลาดเคลื่อนสูงสุดที่ยอมให้ตอนลดจุด หน่วยเป็นพิกเซลบนแผนที่ */
const TOLERANCE_PX = 0.32;
/** เกาะที่เล็กกว่านี้ (ตารางพิกเซล) ถือว่ามองไม่เห็น ตัดทิ้ง */
const MIN_ISLAND_AREA = 2.2;

const MAP_HEIGHT = 830;

/* ── ชื่อไทยและภาค (แบ่ง 6 ภาคตามเกณฑ์คณะกรรมการภูมิศาสตร์แห่งชาติ) ── */
const PROVINCES = {
  "Chiang Mai": ["เชียงใหม่", "north"],
  "Chiang Rai": ["เชียงราย", "north"],
  Lampang: ["ลำปาง", "north"],
  Lamphun: ["ลำพูน", "north"],
  "Mae Hong Son": ["แม่ฮ่องสอน", "north"],
  Nan: ["น่าน", "north"],
  Phayao: ["พะเยา", "north"],
  Phrae: ["แพร่", "north"],
  Uttaradit: ["อุตรดิตถ์", "north"],

  "Amnat Charoen": ["อำนาจเจริญ", "northeast"],
  "Bueng Kan": ["บึงกาฬ", "northeast"],
  "Buri Ram": ["บุรีรัมย์", "northeast"],
  Chaiyaphum: ["ชัยภูมิ", "northeast"],
  Kalasin: ["กาฬสินธุ์", "northeast"],
  "Khon Kaen": ["ขอนแก่น", "northeast"],
  Loei: ["เลย", "northeast"],
  "Maha Sarakham": ["มหาสารคาม", "northeast"],
  Mukdahan: ["มุกดาหาร", "northeast"],
  "Nakhon Phanom": ["นครพนม", "northeast"],
  "Nakhon Ratchasima": ["นครราชสีมา", "northeast"],
  "Nong Bua Lam Phu": ["หนองบัวลำภู", "northeast"],
  "Nong Khai": ["หนองคาย", "northeast"],
  "Roi Et": ["ร้อยเอ็ด", "northeast"],
  "Sakon Nakhon": ["สกลนคร", "northeast"],
  "Si Sa Ket": ["ศรีสะเกษ", "northeast"],
  Surin: ["สุรินทร์", "northeast"],
  "Ubon Ratchathani": ["อุบลราชธานี", "northeast"],
  "Udon Thani": ["อุดรธานี", "northeast"],
  Yasothon: ["ยโสธร", "northeast"],

  "Ang Thong": ["อ่างทอง", "central"],
  "Bangkok Metropolis": ["กรุงเทพมหานคร", "central"],
  "Chai Nat": ["ชัยนาท", "central"],
  "Kamphaeng Phet": ["กำแพงเพชร", "central"],
  "Lop Buri": ["ลพบุรี", "central"],
  "Nakhon Nayok": ["นครนายก", "central"],
  "Nakhon Pathom": ["นครปฐม", "central"],
  "Nakhon Sawan": ["นครสวรรค์", "central"],
  Nonthaburi: ["นนทบุรี", "central"],
  "Pathum Thani": ["ปทุมธานี", "central"],
  Phetchabun: ["เพชรบูรณ์", "central"],
  Phichit: ["พิจิตร", "central"],
  Phitsanulok: ["พิษณุโลก", "central"],
  "Phra Nakhon Si Ayutthaya": ["พระนครศรีอยุธยา", "central"],
  "Samut Prakan": ["สมุทรปราการ", "central"],
  "Samut Sakhon": ["สมุทรสาคร", "central"],
  "Samut Songkhram": ["สมุทรสงคราม", "central"],
  Saraburi: ["สระบุรี", "central"],
  "Sing Buri": ["สิงห์บุรี", "central"],
  Sukhothai: ["สุโขทัย", "central"],
  "Suphan Buri": ["สุพรรณบุรี", "central"],
  "Uthai Thani": ["อุทัยธานี", "central"],

  Chachoengsao: ["ฉะเชิงเทรา", "east"],
  Chanthaburi: ["จันทบุรี", "east"],
  "Chon Buri": ["ชลบุรี", "east"],
  "Prachin Buri": ["ปราจีนบุรี", "east"],
  Rayong: ["ระยอง", "east"],
  "Sa Kaeo": ["สระแก้ว", "east"],
  Trat: ["ตราด", "east"],

  Kanchanaburi: ["กาญจนบุรี", "west"],
  Phetchaburi: ["เพชรบุรี", "west"],
  "Prachuap Khiri Khan": ["ประจวบคีรีขันธ์", "west"],
  Ratchaburi: ["ราชบุรี", "west"],
  Tak: ["ตาก", "west"],

  Chumphon: ["ชุมพร", "south"],
  Krabi: ["กระบี่", "south"],
  "Nakhon Si Thammarat": ["นครศรีธรรมราช", "south"],
  Narathiwat: ["นราธิวาส", "south"],
  Pattani: ["ปัตตานี", "south"],
  Phangnga: ["พังงา", "south"],
  Phatthalung: ["พัทลุง", "south"],
  Phuket: ["ภูเก็ต", "south"],
  Ranong: ["ระนอง", "south"],
  Satun: ["สตูล", "south"],
  Songkhla: ["สงขลา", "south"],
  "Surat Thani": ["สุราษฎร์ธานี", "south"],
  Trang: ["ตรัง", "south"],
  Yala: ["ยะลา", "south"],
};

/** id ที่ใช้ใน src/data/stations.ts ต้องตรงกับที่นี่ */
const ID_OVERRIDES = {
  "Bangkok Metropolis": "bangkok",
  "Phra Nakhon Si Ayutthaya": "ayutthaya",
  "Nakhon Si Thammarat": "nakhon-si",
  "Prachuap Khiri Khan": "prachuap",
  "Chon Buri": "chonburi",
  "Buri Ram": "buriram",
  "Si Sa Ket": "sisaket",
  "Lop Buri": "lopburi",
  "Sing Buri": "singburi",
  "Chai Nat": "chainat",
  "Ang Thong": "angthong",
  "Suphan Buri": "suphanburi",
  "Prachin Buri": "prachinburi",
  "Roi Et": "roiet",
  "Nong Bua Lam Phu": "nongbualamphu",
};

const slug = (name) =>
  ID_OVERRIDES[name] ?? name.toLowerCase().replace(/\s+/g, "-");

/* ── การฉายพิกัด ── */
function makeProjection(bounds) {
  const { minLng, maxLng, minLat, maxLat } = bounds;
  const midLat = ((minLat + maxLat) / 2) * (Math.PI / 180);
  // ชดเชยความกว้างตามละติจูด ไม่งั้นประเทศจะดูอ้วนกว่าความจริง
  const kx = Math.cos(midLat);
  const scale = MAP_HEIGHT / (maxLat - minLat);
  const width = (maxLng - minLng) * kx * scale;
  return {
    width: Number(width.toFixed(2)),
    height: MAP_HEIGHT,
    kx: Number(kx.toFixed(6)),
    scale: Number(scale.toFixed(4)),
    project: (lng, lat) => [
      (lng - minLng) * kx * scale,
      (maxLat - lat) * scale,
    ],
  };
}

/* ── Ramer–Douglas–Peucker ── */
function rdp(points, eps) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  let index = -1;
  let maxDist = 0;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const dist =
      len === 0
        ? Math.hypot(px - ax, py - ay)
        : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  if (maxDist <= eps) return [points[0], points[points.length - 1]];
  return [
    ...rdp(points.slice(0, index + 1), eps).slice(0, -1),
    ...rdp(points.slice(index), eps),
  ];
}

const ringArea = (pts) => {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a / 2);
};

/** จุดกึ่งกลางเชิงพื้นที่ของวงรอบ ใช้วางป้ายชื่อจังหวัด */
function ringCentroid(pts) {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const f = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
    a += f;
    cx += (pts[j][0] + pts[i][0]) * f;
    cy += (pts[j][1] + pts[i][1]) * f;
  }
  a *= 0.5;
  if (a === 0) return pts[0];
  return [cx / (6 * a), cy / (6 * a)];
}

const round = (n) => Number(n.toFixed(1));

/* ── main ── */
const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ: ${res.status}`);
const geo = await res.json();

let minLng = Infinity;
let maxLng = -Infinity;
let minLat = Infinity;
let maxLat = -Infinity;
const ringsOf = (g) =>
  g.type === "Polygon" ? g.coordinates : g.coordinates.flat();

for (const f of geo.features) {
  for (const ring of ringsOf(f.geometry)) {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
}

const proj = makeProjection({ minLng, maxLng, minLat, maxLat });

let pointsBefore = 0;
let pointsAfter = 0;
let droppedIslands = 0;
const out = [];

for (const f of geo.features) {
  const name = f.properties.name;
  const meta = PROVINCES[name];
  if (!meta) throw new Error(`ยังไม่ได้จับคู่ชื่อจังหวัด: ${name}`);
  const [nameTh, region] = meta;

  const kept = [];
  for (const ring of ringsOf(f.geometry)) {
    pointsBefore += ring.length;
    const projected = ring.map(([lng, lat]) => proj.project(lng, lat));
    if (ringArea(projected) < MIN_ISLAND_AREA) {
      droppedIslands++;
      continue;
    }
    const simplified = rdp(projected, TOLERANCE_PX).map(([x, y]) => [
      round(x),
      round(y),
    ]);
    if (simplified.length < 3) continue;
    pointsAfter += simplified.length;
    kept.push(simplified);
  }
  if (!kept.length) continue;

  kept.sort((a, b) => ringArea(b) - ringArea(a));
  const d = kept
    .map(
      (ring) =>
        "M" + ring.map(([x, y]) => `${x},${y}`).join("L") + "Z",
    )
    .join("");
  const [cx, cy] = ringCentroid(kept[0]);
  const flat = kept.flat();
  const bbox = [
    round(Math.min(...flat.map((q) => q[0]))),
    round(Math.min(...flat.map((q) => q[1]))),
    round(Math.max(...flat.map((q) => q[0]))),
    round(Math.max(...flat.map((q) => q[1]))),
  ];

  out.push({
    id: slug(name),
    name: nameTh,
    nameEn: name,
    region,
    d,
    label: [round(cx), round(cy)],
    bbox,
    area: Math.round(kept.reduce((n, r) => n + ringArea(r), 0)),
  });
}

out.sort((a, b) => a.id.localeCompare(b.id));

const body = `/**
 * ⚠️ ไฟล์นี้สร้างอัตโนมัติ — อย่าแก้ด้วยมือ
 * สร้างใหม่ด้วย: node scripts/build-thailand-geo.mjs
 *
 * ขอบเขตจังหวัดจริงทั้ง 77 จังหวัด จาก https://github.com/apisit/thailand.json
 * ฉายลงระนาบและลดจำนวนจุดไว้แล้ว (คลาดเคลื่อนไม่เกิน ${TOLERANCE_PX} พิกเซลบนแผนที่)
 */

export type RegionId =
  | "north"
  | "northeast"
  | "central"
  | "east"
  | "west"
  | "south";

export const MAP_W = ${proj.width};
export const MAP_H = ${proj.height};

/** ค่าที่ใช้ตอนฉายพิกัด — ต้องใช้ชุดเดียวกันเวลาวางหมุดจาก lat/lng */
export const PROJECTION = {
  minLng: ${minLng},
  maxLng: ${maxLng},
  minLat: ${minLat},
  maxLat: ${maxLat},
  kx: ${proj.kx},
  scale: ${proj.scale},
};

export function project(lng: number, lat: number): [number, number] {
  const { minLng, maxLat, kx, scale } = PROJECTION;
  return [(lng - minLng) * kx * scale, (maxLat - lat) * scale];
}

export type ProvinceShape = {
  id: string;
  name: string;
  nameEn: string;
  region: RegionId;
  /** เส้นขอบจังหวัดในระบบพิกัดของ SVG */
  d: string;
  /** จุดวางป้ายชื่อ */
  label: [number, number];
  /** กรอบสี่เหลี่ยม [minX, minY, maxX, maxY] ใช้คำนวณระยะซูม */
  bbox: [number, number, number, number];
};

export const provinceShapes: ProvinceShape[] = [
${out
  .map(
    (p) =>
      `  { id: ${JSON.stringify(p.id)}, name: ${JSON.stringify(p.name)}, nameEn: ${JSON.stringify(p.nameEn)}, region: ${JSON.stringify(p.region)}, label: [${p.label[0]}, ${p.label[1]}], bbox: [${p.bbox.join(", ")}], d: ${JSON.stringify(p.d)} },`,
  )
  .join("\n")}
];
`;

writeFileSync(new URL("../src/data/thailand-geo.ts", import.meta.url), body);

console.log(`จังหวัด: ${out.length}`);
console.log(`จุด: ${pointsBefore.toLocaleString()} → ${pointsAfter.toLocaleString()} (เหลือ ${Math.round((pointsAfter / pointsBefore) * 100)}%)`);
console.log(`ตัดเกาะเล็ก: ${droppedIslands} วง`);
console.log(`viewBox: 0 0 ${proj.width} ${proj.height}`);
