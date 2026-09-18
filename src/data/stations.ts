import { provinceById, type RegionId } from "./geo";
import { stationPhoto } from "./images";

/**
 * ⚠️ MOCK DATA — ข้อมูลสถานีทั้งหมดในไฟล์นี้เป็นข้อมูลสมมติสำหรับทำ UI prototype
 * ชื่อเครือข่ายเป็นชื่อจริงตามโจทย์ แต่จำนวนหัวชาร์จ ราคา คะแนนรีวิว
 * และพิกัด เป็นข้อมูลจำลองทั้งหมด — ต้องเปลี่ยนเป็นข้อมูลจริงก่อนขึ้น production
 *
 * ตั้งใจไม่เก็บ "จำนวนหัวที่ว่างอยู่ตอนนี้" เพราะเป็นค่าที่ต้องต่อกับระบบของแต่ละเครือข่าย
 * แบบเรียลไทม์ ถ้าเก็บเป็นค่านิ่ง ๆ ไว้จะกลายเป็นข้อมูลที่ผิดเกือบตลอดเวลา
 */

export type ConnectorType = "CCS2" | "Type 2" | "CHAdeMO";
export type SpeedTier = "ac" | "dc" | "ultra";
export type AmenityId =
  | "restroom"
  | "cafe"
  | "restaurant"
  | "mall"
  | "convenience"
  | "wifi"
  | "freeParking";

export type NetworkId =
  | "ea-anywhere"
  | "pea-volta"
  | "ev-station-pluz"
  | "mea-ev"
  | "elexa"
  | "sharge"
  | "evolt"
  | "igreen"
  | "spark";

export const networks: Record<
  NetworkId,
  { id: NetworkId; name: string; short: string; color: string; appId: string }
> = {
  "ea-anywhere": { id: "ea-anywhere", name: "EA Anywhere", short: "EA", color: "#2f9e44", appId: "ea-anywhere" },
  "pea-volta": { id: "pea-volta", name: "PEA VOLTA", short: "PEA", color: "#7048a8", appId: "pea-volta" },
  "ev-station-pluz": { id: "ev-station-pluz", name: "EV Station PluZ", short: "PluZ", color: "#0b7285", appId: "ev-station-pluz" },
  "mea-ev": { id: "mea-ev", name: "MEA EV", short: "MEA", color: "#d9480f", appId: "mea-ev" },
  elexa: { id: "elexa", name: "EleXA", short: "EleXA", color: "#1864ab", appId: "elexa" },
  sharge: { id: "sharge", name: "SHARGE", short: "SHARGE", color: "#e8590c", appId: "sharge" },
  evolt: { id: "evolt", name: "EVolt", short: "EVolt", color: "#0ca678", appId: "evolt" },
  igreen: { id: "igreen", name: "iGreen+", short: "iGreen", color: "#5c940d", appId: "igreen" },
  spark: { id: "spark", name: "Spark", short: "Spark", color: "#1098ad", appId: "spark" },
};

export const amenityLabels: Record<AmenityId, string> = {
  restroom: "ห้องน้ำ",
  cafe: "ร้านกาแฟ",
  restaurant: "ร้านอาหาร",
  mall: "ห้างสรรพสินค้า",
  convenience: "ร้านสะดวกซื้อ",
  wifi: "Wi-Fi ฟรี",
  freeParking: "จอดฟรีระหว่างชาร์จ",
};

export const connectorInfo: Record<
  ConnectorType,
  { label: string; current: "AC" | "DC"; note: string }
> = {
  "Type 2": { label: "Type 2", current: "AC", note: "หัวมาตรฐานยุโรป ใช้กับการชาร์จแบบ AC" },
  CCS2: { label: "CCS2", current: "DC", note: "หัวชาร์จเร็วที่รถ EV ส่วนใหญ่ในไทยใช้" },
  CHAdeMO: { label: "CHAdeMO", current: "DC", note: "หัวชาร์จเร็วมาตรฐานญี่ปุ่น พบน้อยลงเรื่อย ๆ" },
};

export type Connector = {
  type: ConnectorType;
  kw: number;
  total: number;
};

export type Review = {
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type NearbyPlace = {
  name: string;
  category: "cafe" | "food" | "shop" | "restroom" | "mall";
  walkMin: number;
};

export type Station = {
  id: string;
  name: string;
  network: NetworkId;
  provinceId: string;
  region: RegionId;
  lat: number;
  lng: number;
  address: string;
  connectors: Connector[];
  pricePerKwh: number;
  parkingNote: string;
  open24: boolean;
  hours: string;
  amenities: AmenityId[];
  rating: number;
  reviewCount: number;
  photo: string;
  photoIndex: number;
  reviews: Review[];
  nearby: NearbyPlace[];
};

/* ────────── คลังรีวิวและร้านค้าใกล้เคียง (ทีมงานเขียนเองในระบบหลังบ้าน) ────────── */

const reviewPool: Omit<Review, "date">[] = [
  { author: "ทีมสำรวจ Recharger", rating: 5, text: "หัว CCS2 จ่ายไฟได้เต็มสเปกจริง ลานจอดกว้าง เข้า-ออกสะดวก แม้ช่วงเย็นวันศุกร์" },
  { author: "ทีมสำรวจ Recharger", rating: 4, text: "ตำแหน่งหาไม่ยาก มีป้ายบอกชัดเจน แต่ช่วง 18:00–20:00 มักต้องรอคิวประมาณ 10–15 นาที" },
  { author: "ทีมสำรวจ Recharger", rating: 5, text: "จุดนี้เหมาะกับการแวะพักระหว่างทาง มีห้องน้ำสะอาดและร้านกาแฟเปิดคู่กัน" },
  { author: "ทีมสำรวจ Recharger", rating: 4, text: "แอปเชื่อมต่อไว จ่ายผ่านบัตรได้ไม่มีปัญหา สายชาร์จค่อนข้างสั้น รถคันใหญ่ต้องถอยเข้าให้พอดีช่อง" },
  { author: "ทีมสำรวจ Recharger", rating: 5, text: "ชาร์จจาก 20% ถึง 80% ใช้เวลาประมาณ 35 นาที ตรงตามที่ระบุไว้หน้าตู้" },
  { author: "ทีมสำรวจ Recharger", rating: 3, text: "ตู้ใช้งานได้ปกติ แต่แสงสว่างตอนกลางคืนน้อย ควรมาช่วงกลางวันถ้าไม่คุ้นทาง" },
  { author: "ทีมสำรวจ Recharger", rating: 4, text: "จอดฟรีระหว่างชาร์จ มีร้านสะดวกซื้ออยู่ติดกัน เหมาะกับการแวะสั้น ๆ" },
  { author: "ทีมสำรวจ Recharger", rating: 5, text: "หัวชาร์จหลายช่อง โอกาสรอคิวต่ำ เป็นจุดที่แนะนำสำหรับคนขับทางไกล" },
];

const nearbyPool: NearbyPlace[] = [
  { name: "Café Amazon", category: "cafe", walkMin: 1 },
  { name: "7-Eleven", category: "shop", walkMin: 2 },
  { name: "ห้องน้ำสาธารณะ ชั้น G", category: "restroom", walkMin: 2 },
  { name: "ศูนย์อาหารชั้นใต้ดิน", category: "food", walkMin: 3 },
  { name: "Starbucks", category: "cafe", walkMin: 4 },
  { name: "Lotus's go fresh", category: "shop", walkMin: 5 },
  { name: "ร้านก๋วยเตี๋ยวเรือป้าน้อย", category: "food", walkMin: 5 },
  { name: "โซนร้านค้าชั้น 1", category: "mall", walkMin: 2 },
  { name: "KFC", category: "food", walkMin: 3 },
  { name: "ร้านกาแฟท้องถิ่น ริมทาง", category: "cafe", walkMin: 6 },
  { name: "มินิมาร์ทในปั๊ม", category: "shop", walkMin: 1 },
  { name: "ห้องน้ำในปั๊มน้ำมัน", category: "restroom", walkMin: 1 },
];

/** hash คงที่ เพื่อให้ mock data ออกมาเหมือนเดิมทุกครั้ง ไม่กระพริบตอน re-render */
function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickReviews(id: string, count: number): Review[] {
  const s = seed(id);
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const base = reviewPool[(s + i * 3) % reviewPool.length];
    const day = 1 + ((s + i * 7) % 27);
    const month = 1 + ((s + i * 5) % 9);
    out.push({ ...base, date: `2026-0${month}-${String(day).padStart(2, "0")}` });
  }
  return out;
}

function pickNearby(id: string, amenities: AmenityId[]): NearbyPlace[] {
  const s = seed(id + "n");
  const pool = amenities.includes("mall")
    ? nearbyPool
    : nearbyPool.filter((p) => p.category !== "mall");
  const out: NearbyPlace[] = [];
  for (let i = 0; out.length < 4 && i < pool.length * 2; i++) {
    const p = pool[(s + i * 5) % pool.length];
    if (!out.some((x) => x.name === p.name)) out.push(p);
  }
  return out.sort((a, b) => a.walkMin - b.walkMin);
}

type MkOpts = {
  price: number;
  parking?: string;
  open24?: boolean;
  hours?: string;
  rating: number;
  reviews: number;
  amenities: AmenityId[];
  photo: number;
  dLat?: number;
  dLng?: number;
};

function mk(
  id: string,
  name: string,
  network: NetworkId,
  provinceId: string,
  address: string,
  conns: Array<[ConnectorType, number, number]>,
  o: MkOpts,
): Station {
  const p = provinceById[provinceId];
  const connectors: Connector[] = conns.map(([type, kw, total]) => ({
    type,
    kw,
    total,
  }));
  return {
    id,
    name,
    network,
    provinceId,
    region: p.region,
    lat: Number((p.lat + (o.dLat ?? 0)).toFixed(4)),
    lng: Number((p.lng + (o.dLng ?? 0)).toFixed(4)),
    address,
    connectors,
    pricePerKwh: o.price,
    parkingNote: o.parking ?? "จอดฟรีระหว่างชาร์จ 2 ชั่วโมงแรก",
    open24: o.open24 ?? false,
    hours: o.open24 ? "เปิด 24 ชั่วโมง" : (o.hours ?? "10:00 – 22:00 น."),
    amenities: o.amenities,
    rating: o.rating,
    reviewCount: o.reviews,
    photo: stationPhoto(o.photo),
    photoIndex: o.photo,
    reviews: pickReviews(id, 3),
    nearby: pickNearby(id, o.amenities),
  };
}

export const stations: Station[] = [
  /* ── ภาคกลาง ───────────────────────────────────────── */
  mk("st-001", "เซ็นทรัลเวิลด์ ชั้น B1", "ea-anywhere", "bangkok", "999/9 ถ.พระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ",
    [["CCS2", 120, 4], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.7, reviews: 214, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 0, dLat: -0.01, dLng: 0.038 }),
  mk("st-002", "สยามพารากอน อาคารจอดรถ", "elexa", "bangkok", "991 ถ.พระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ",
    [["CCS2", 150, 2], ["Type 2", 22, 4]],
    { price: 8.0, rating: 4.5, reviews: 176, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 1, dLat: -0.0125, dLng: 0.032 }),
  mk("st-003", "เซ็นทรัล ลาดพร้าว", "ev-station-pluz", "bangkok", "1697 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ",
    [["CCS2", 120, 3], ["CHAdeMO", 50, 1]],
    { price: 7.5, rating: 4.4, reviews: 132, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 2, dLat: 0.06, dLng: 0.058 }),
  mk("st-004", "เมกาบางนา โซนจอดรถ A", "sharge", "samut-prakan", "39 หมู่ 6 ถ.บางนา-ตราด ต.บางแก้ว อ.บางพลี สมุทรปราการ",
    [["CCS2", 150, 4], ["Type 2", 22, 4]],
    { price: 8.5, rating: 4.6, reviews: 198, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi", "freeParking"], photo: 3, dLat: 0.05, dLng: 0.07 }),
  mk("st-005", "ไอคอนสยาม ชั้น B2", "mea-ev", "bangkok", "299 ถ.เจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพฯ",
    [["CCS2", 120, 2], ["Type 2", 22, 6]],
    { price: 7.8, rating: 4.8, reviews: 241, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 4, dLat: -0.028, dLng: 0.008 }),
  mk("st-006", "เดอะมอลล์ บางกะปิ", "mea-ev", "bangkok", "3522 ถ.ลาดพร้าว แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ",
    [["Type 2", 22, 4]],
    { price: 6.5, rating: 4.1, reviews: 87, amenities: ["mall", "restroom", "restaurant"], photo: 5, dLat: 0.012, dLng: 0.145 }),
  mk("st-007", "PTT Station วิภาวดี 62", "ev-station-pluz", "bangkok", "ถ.วิภาวดีรังสิต แขวงตลาดบางเขน เขตหลักสี่ กรุงเทพฯ",
    [["CCS2", 150, 2], ["CHAdeMO", 50, 1]],
    { price: 7.5, open24: true, rating: 4.5, reviews: 156, amenities: ["restroom", "cafe", "convenience"], photo: 6, dLat: 0.115, dLng: 0.066, parking: "จอดฟรีระหว่างชาร์จ" }),
  mk("st-008", "เซ็นทรัล เวสต์เกต", "ea-anywhere", "nonthaburi", "199/2 หมู่ 6 ต.เสาธงหิน อ.บางใหญ่ นนทบุรี",
    [["CCS2", 120, 4], ["Type 2", 22, 2]],
    { price: 7.2, rating: 4.6, reviews: 143, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 7, dLat: 0.015, dLng: -0.09 }),
  mk("st-009", "ฟิวเจอร์พาร์ค รังสิต", "elexa", "pathum-thani", "94 ถ.พหลโยธิน ต.ประชาธิปัตย์ อ.ธัญบุรี ปทุมธานี",
    [["CCS2", 120, 3], ["Type 2", 22, 4]],
    { price: 7.8, rating: 4.3, reviews: 118, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 8, dLat: 0.01, dLng: 0.095 }),
  mk("st-010", "เซ็นทรัล อยุธยา", "ea-anywhere", "ayutthaya", "126 หมู่ 3 ถ.สายเอเชีย ต.คลองสวนพลู อ.พระนครศรีอยุธยา",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.2, rating: 4.4, reviews: 76, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 9, dLat: -0.012, dLng: 0.028 }),
  mk("st-011", "PEA สำนักงานสระบุรี", "pea-volta", "saraburi", "ถ.พหลโยธิน ต.ปากเพรียว อ.เมืองสระบุรี สระบุรี",
    [["CCS2", 120, 2], ["CHAdeMO", 50, 1]],
    { price: 6.8, open24: true, rating: 4.2, reviews: 64, amenities: ["restroom", "freeParking"], photo: 10, dLat: 0.006, dLng: -0.012 }),
  mk("st-012", "PTT Station มิตรภาพ ขาขึ้น", "ev-station-pluz", "saraburi", "ถ.มิตรภาพ กม.12 ต.ตาลเดี่ยว อ.แก่งคอย สระบุรี",
    [["CCS2", 150, 4], ["CHAdeMO", 50, 1]],
    { price: 7.5, open24: true, rating: 4.7, reviews: 203, amenities: ["restroom", "cafe", "convenience", "restaurant"], photo: 11, dLat: 0.055, dLng: 0.125, parking: "จอดฟรีระหว่างชาร์จ" }),
  mk("st-013", "เซ็นทรัล นครสวรรค์", "evolt", "nakhon-sawan", "1/1 หมู่ 1 ถ.พหลโยธิน ต.นครสวรรค์ตก อ.เมืองฯ นครสวรรค์",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.0, rating: 4.3, reviews: 58, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 12, dLat: 0.008, dLng: -0.018 }),
  mk("st-014", "เซ็นทรัล พิษณุโลก", "pea-volta", "phitsanulok", "9/99 หมู่ 5 ต.พลายชุมพล อ.เมืองพิษณุโลก พิษณุโลก",
    [["CCS2", 120, 3], ["Type 2", 22, 2]],
    { price: 6.8, rating: 4.5, reviews: 91, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 13, dLat: -0.01, dLng: -0.035 }),
  mk("st-015", "ท่าอากาศยานสุวรรณภูมิ อาคารจอดรถ 2", "spark", "samut-prakan", "999 หมู่ 1 ต.หนองปรือ อ.บางพลี สมุทรปราการ",
    [["CCS2", 150, 6], ["Type 2", 22, 8]],
    { price: 9.0, open24: true, rating: 4.6, reviews: 267, amenities: ["restroom", "cafe", "restaurant", "convenience", "wifi"], photo: 14, dLat: 0.093, dLng: 0.153, parking: "คิดค่าจอดตามอัตราสนามบิน" }),
  mk("st-016", "ดิ เอ็มควอเทียร์", "sharge", "bangkok", "693 ถ.สุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ",
    [["CCS2", 150, 2], ["Type 2", 22, 4]],
    { price: 8.5, rating: 4.4, reviews: 129, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 0, dLat: -0.024, dLng: 0.067 }),

  /* ── ภาคตะวันออก ───────────────────────────────────── */
  mk("st-017", "เซ็นทรัล พัทยาบีช", "ea-anywhere", "chonburi", "333/101 หมู่ 9 ถ.พัทยาสายหนึ่ง ต.หนองปรือ อ.บางละมุง ชลบุรี",
    [["CCS2", 150, 4], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.7, reviews: 188, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 1, dLat: -0.43, dLng: -0.09 }),
  mk("st-018", "เทอร์มินอล 21 พัทยา", "sharge", "chonburi", "456 หมู่ 6 ถ.พัทยาสายสอง ต.นาเกลือ อ.บางละมุง ชลบุรี",
    [["CCS2", 120, 2], ["Type 2", 22, 4]],
    { price: 8.5, rating: 4.5, reviews: 142, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 2, dLat: -0.39, dLng: -0.095 }),
  mk("st-019", "แหลมฉบัง ทรัค เทอร์มินอล", "igreen", "chonburi", "ถ.สุขุมวิท ต.ทุ่งสุขลา อ.ศรีราชา ชลบุรี",
    [["CCS2", 180, 4]],
    { price: 7.0, open24: true, rating: 4.2, reviews: 47, amenities: ["restroom", "convenience"], photo: 3, dLat: -0.28, dLng: -0.09, parking: "จอดฟรีระหว่างชาร์จ" }),
  mk("st-020", "เซ็นทรัล ระยอง", "elexa", "rayong", "99 ถ.บางนา-ตราด ต.เชิงเนิน อ.เมืองระยอง ระยอง",
    [["CCS2", 120, 3], ["Type 2", 22, 2]],
    { price: 7.8, rating: 4.4, reviews: 103, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 4, dLat: 0.016, dLng: -0.03 }),
  mk("st-021", "PTT Station บ้านฉาง", "ev-station-pluz", "rayong", "ถ.สุขุมวิท ต.บ้านฉาง อ.บ้านฉาง ระยอง",
    [["CCS2", 150, 2], ["CHAdeMO", 50, 1]],
    { price: 7.5, open24: true, rating: 4.6, reviews: 88, amenities: ["restroom", "cafe", "convenience"], photo: 5, dLat: -0.017, dLng: -0.213, parking: "จอดฟรีระหว่างชาร์จ" }),
  mk("st-022", "เซ็นทรัล จันทบุรี", "pea-volta", "chanthaburi", "31 หมู่ 7 ถ.สุขุมวิท ต.จันทนิมิต อ.เมืองจันทบุรี จันทบุรี",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 6.8, rating: 4.3, reviews: 54, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 6, dLat: 0.005, dLng: 0.009 }),
  mk("st-023", "ศาลากลางจังหวัดตราด", "pea-volta", "trat", "ถ.ราษฎร์นิยม ต.บางพระ อ.เมืองตราด ตราด",
    [["CCS2", 120, 1], ["Type 2", 22, 1]],
    { price: 6.8, hours: "08:00 – 18:00 น.", rating: 3.9, reviews: 26, amenities: ["restroom", "freeParking"], photo: 7, dLat: 0.003, dLng: -0.005 }),
  mk("st-024", "โรบินสัน ฉะเชิงเทรา", "evolt", "chachoengsao", "910 หมู่ 1 ถ.ฉะเชิงเทรา-บางปะกง ต.บางตีนเป็ด อ.เมืองฯ ฉะเชิงเทรา",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.0, rating: 4.2, reviews: 61, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 8, dLat: -0.012, dLng: -0.02 }),

  /* ── ภาคเหนือ ──────────────────────────────────────── */
  mk("st-025", "เซ็นทรัล เฟสติวัล เชียงใหม่", "ea-anywhere", "chiang-mai", "99/3 หมู่ 4 ถ.ซุปเปอร์ไฮเวย์ ต.ฟ้าฮ่าม อ.เมืองเชียงใหม่",
    [["CCS2", 150, 4], ["Type 2", 22, 4]],
    { price: 7.5, rating: 4.8, reviews: 231, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi", "freeParking"], photo: 9, dLat: 0.017, dLng: 0.021 }),
  mk("st-026", "นิมมานเหมินท์ วัน", "sharge", "chiang-mai", "ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมืองเชียงใหม่ เชียงใหม่",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 8.5, rating: 4.3, reviews: 96, amenities: ["restroom", "cafe", "restaurant", "wifi"], photo: 10, dLat: 0.012, dLng: -0.019 }),
  mk("st-027", "เมญ่า ไลฟ์สไตล์ ช้อปปิ้งเซ็นเตอร์", "elexa", "chiang-mai", "55 หมู่ 5 ถ.ห้วยแก้ว ต.ช้างเผือก อ.เมืองเชียงใหม่",
    [["CCS2", 120, 2], ["Type 2", 22, 4]],
    { price: 7.8, rating: 4.5, reviews: 114, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 11, dLat: 0.015, dLng: -0.013 }),
  mk("st-028", "เซ็นทรัล เชียงราย", "ev-station-pluz", "chiang-rai", "99/9 หมู่ 13 ต.รอบเวียง อ.เมืองเชียงราย เชียงราย",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.4, reviews: 72, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 12, dLat: -0.013, dLng: 0.012 }),
  mk("st-029", "PEA ลำปาง", "pea-volta", "lampang", "ถ.พหลโยธิน ต.สวนดอก อ.เมืองลำปาง ลำปาง",
    [["CCS2", 120, 2], ["CHAdeMO", 50, 1]],
    { price: 6.8, open24: true, rating: 4.1, reviews: 43, amenities: ["restroom", "freeParking"], photo: 13, dLat: 0.005, dLng: -0.008 }),
  mk("st-030", "น่าน ริเวอร์ไซด์ พลาซ่า", "evolt", "nan", "ถ.สุมนเทวราช ต.ในเวียง อ.เมืองน่าน น่าน",
    [["CCS2", 120, 1], ["Type 2", 22, 2]],
    { price: 7.0, hours: "09:00 – 21:00 น.", rating: 4.2, reviews: 31, amenities: ["restroom", "cafe", "restaurant"], photo: 14, dLat: 0.004, dLng: 0.006 }),
  mk("st-031", "แม่ฮ่องสอน ทาวน์ เซ็นเตอร์", "pea-volta", "mae-hong-son", "ถ.ขุนลุมประพาส ต.จองคำ อ.เมืองแม่ฮ่องสอน",
    [["CCS2", 120, 1], ["Type 2", 22, 1]],
    { price: 6.8, hours: "08:00 – 20:00 น.", rating: 4.0, reviews: 18, amenities: ["restroom", "cafe", "freeParking"], photo: 0, dLat: 0.003, dLng: 0.004 }),

  /* ── ภาคตะวันออกเฉียงเหนือ ─────────────────────────── */
  mk("st-032", "เดอะมอลล์ โคราช", "ea-anywhere", "nakhon-ratchasima", "1242/2 ถ.มิตรภาพ-หนองคาย ต.ในเมือง อ.เมืองนครราชสีมา",
    [["CCS2", 150, 4], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.6, reviews: 164, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 1, dLat: 0.018, dLng: 0.011 }),
  mk("st-033", "เทอร์มินอล 21 โคราช", "elexa", "nakhon-ratchasima", "99 ถ.มิตรภาพ ต.ในเมือง อ.เมืองนครราชสีมา นครราชสีมา",
    [["CCS2", 120, 2], ["Type 2", 22, 4]],
    { price: 7.8, rating: 4.5, reviews: 137, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 2, dLat: 0.008, dLng: 0.006 }),
  mk("st-034", "เซ็นทรัล ขอนแก่น", "ev-station-pluz", "khon-kaen", "99/99 หมู่ 4 ถ.ศรีจันทร์ ต.ในเมือง อ.เมืองขอนแก่น",
    [["CCS2", 150, 3], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.6, reviews: 121, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 3, dLat: 0.005, dLng: 0.012 }),
  mk("st-035", "PEA ขอนแก่น", "pea-volta", "khon-kaen", "ถ.มิตรภาพ ต.ในเมือง อ.เมืองขอนแก่น ขอนแก่น",
    [["CCS2", 120, 2], ["CHAdeMO", 50, 1]],
    { price: 6.8, open24: true, rating: 4.2, reviews: 69, amenities: ["restroom", "freeParking"], photo: 4, dLat: -0.012, dLng: -0.018 }),
  mk("st-036", "เซ็นทรัล อุดรธานี", "ea-anywhere", "udon-thani", "277/1 ถ.ประจักษ์ศิลปาคม ต.หมากแข้ง อ.เมืองอุดรธานี",
    [["CCS2", 120, 3], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.5, reviews: 98, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 5, dLat: -0.004, dLng: 0.009 }),
  mk("st-037", "เซ็นทรัล อุบลราชธานี", "evolt", "ubon-ratchathani", "311 หมู่ 7 ถ.เลี่ยงเมือง ต.แจระแม อ.เมืองอุบลราชธานี",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.0, rating: 4.3, reviews: 66, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 6, dLat: 0.012, dLng: -0.032 }),
  mk("st-038", "ด่านมิตรภาพ หนองคาย", "pea-volta", "nong-khai", "ถ.มิตรภาพ ต.มีชัย อ.เมืองหนองคาย หนองคาย",
    [["CCS2", 120, 2], ["Type 2", 22, 1]],
    { price: 6.8, open24: true, rating: 4.0, reviews: 34, amenities: ["restroom", "convenience", "freeParking"], photo: 7, dLat: -0.015, dLng: 0.02 }),
  mk("st-039", "บุรีรัมย์ คาสเซิล", "igreen", "buriram", "ถ.บุรีรัมย์-ประโคนชัย ต.อิสาณ อ.เมืองบุรีรัมย์ บุรีรัมย์",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.0, rating: 4.4, reviews: 52, amenities: ["restroom", "cafe", "restaurant", "freeParking"], photo: 8, dLat: -0.02, dLng: 0.015 }),

  /* ── ภาคใต้ ────────────────────────────────────────── */
  mk("st-040", "เซ็นทรัล ภูเก็ต ฟลอเรสต้า", "ea-anywhere", "phuket", "199 หมู่ 4 ถ.วิชิตสงคราม ต.วิชิต อ.เมืองภูเก็ต ภูเก็ต",
    [["CCS2", 150, 4], ["Type 2", 22, 4]],
    { price: 7.5, rating: 4.7, reviews: 209, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 9, dLat: 0.013, dLng: 0.006 }),
  mk("st-041", "ป่าตอง บีช พาร์คกิ้ง", "sharge", "phuket", "ถ.ทวีวงศ์ ต.ป่าตอง อ.กะทู้ ภูเก็ต",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 8.5, open24: true, rating: 4.1, reviews: 78, amenities: ["restroom", "restaurant", "convenience"], photo: 10, dLat: 0.017, dLng: -0.093, parking: "คิดค่าจอดตามอัตราของลาน" }),
  mk("st-042", "ท่าอากาศยานภูเก็ต", "spark", "phuket", "222 หมู่ 6 ต.ไม้ขาว อ.ถลาง ภูเก็ต",
    [["CCS2", 150, 4], ["Type 2", 22, 4]],
    { price: 9.0, open24: true, rating: 4.5, reviews: 143, amenities: ["restroom", "cafe", "restaurant", "convenience", "wifi"], photo: 11, dLat: 0.268, dLng: -0.083, parking: "คิดค่าจอดตามอัตราสนามบิน" }),
  mk("st-043", "เซ็นทรัล สุราษฎร์ธานี", "ev-station-pluz", "surat-thani", "88/1 หมู่ 10 ถ.เลี่ยงเมือง ต.วัดประดู่ อ.เมืองสุราษฎร์ธานี",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.4, reviews: 81, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 12, dLat: -0.02, dLng: 0.022 }),
  mk("st-044", "เซ็นทรัล นครศรีธรรมราช", "elexa", "nakhon-si", "8, 8/1 หมู่ 7 ถ.พัฒนาการคูขวาง ต.ท่าเรือ อ.เมืองนครศรีธรรมราช",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.8, rating: 4.3, reviews: 67, amenities: ["mall", "restroom", "cafe", "restaurant", "freeParking"], photo: 13, dLat: -0.017, dLng: -0.006 }),
  mk("st-045", "เซ็นทรัล หาดใหญ่", "ea-anywhere", "songkhla", "1518, 1 ถ.กาญจนวนิช ต.หาดใหญ่ อ.หาดใหญ่ สงขลา",
    [["CCS2", 150, 3], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.6, reviews: 154, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 14, dLat: -0.185, dLng: -0.12 }),
  mk("st-046", "PEA สงขลา", "pea-volta", "songkhla", "ถ.ราชดำเนินนอก ต.บ่อยาง อ.เมืองสงขลา สงขลา",
    [["CCS2", 120, 2], ["CHAdeMO", 50, 1]],
    { price: 6.8, open24: true, rating: 4.0, reviews: 39, amenities: ["restroom", "freeParking"], photo: 0, dLat: 0.005, dLng: 0.008 }),
  mk("st-047", "อ่าวนาง วิลเลจ", "evolt", "krabi", "ถ.อ่าวนาง ต.อ่าวนาง อ.เมืองกระบี่ กระบี่",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.0, hours: "07:00 – 23:00 น.", rating: 4.4, reviews: 57, amenities: ["restroom", "cafe", "restaurant", "convenience"], photo: 1, dLat: -0.06, dLng: -0.085 }),
  mk("st-048", "ชุมพร ริมทะเล พาร์ค", "igreen", "chumphon", "ถ.ชุมพร-ปากน้ำ ต.ท่ายาง อ.เมืองชุมพร ชุมพร",
    [["CCS2", 120, 2], ["Type 2", 22, 1]],
    { price: 7.0, open24: true, rating: 4.2, reviews: 41, amenities: ["restroom", "cafe", "convenience", "freeParking"], photo: 2, dLat: -0.02, dLng: 0.075 }),

  /* ── ภาคตะวันตก ────────────────────────────────────── */
  mk("st-049", "กาญจนบุรี ริเวอร์แคว พลาซ่า", "pea-volta", "kanchanaburi", "ถ.แสงชูโต ต.บ้านเหนือ อ.เมืองกาญจนบุรี กาญจนบุรี",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 6.8, rating: 4.3, reviews: 48, amenities: ["restroom", "cafe", "restaurant", "freeParking"], photo: 3, dLat: 0.005, dLng: -0.004 }),
  mk("st-050", "โรบินสัน ราชบุรี", "evolt", "ratchaburi", "265 หมู่ 10 ถ.เพชรเกษม ต.เจดีย์หัก อ.เมืองราชบุรี ราชบุรี",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.0, rating: 4.2, reviews: 55, amenities: ["mall", "restroom", "cafe", "restaurant"], photo: 4, dLat: -0.008, dLng: -0.021 }),
  mk("st-051", "มาร์เก็ตวิลเลจ หัวหิน", "ea-anywhere", "prachuap", "234/1 ถ.เพชรเกษม ต.หัวหิน อ.หัวหิน ประจวบคีรีขันธ์",
    [["CCS2", 150, 3], ["Type 2", 22, 2]],
    { price: 7.5, rating: 4.6, reviews: 126, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi", "freeParking"], photo: 5, dLat: 0.756, dLng: -0.03 }),
  mk("st-052", "บลูพอร์ต หัวหิน", "sharge", "prachuap", "8/89 ถ.เพชรเกษม ต.หัวหิน อ.หัวหิน ประจวบคีรีขันธ์",
    [["CCS2", 120, 2], ["Type 2", 22, 4]],
    { price: 8.5, rating: 4.5, reviews: 94, amenities: ["mall", "restroom", "cafe", "restaurant", "wifi"], photo: 6, dLat: 0.744, dLng: -0.021 }),
  mk("st-053", "ชะอำ บีชฟรอนต์", "ev-station-pluz", "phetchaburi", "ถ.ร่วมจิตร ต.ชะอำ อ.ชะอำ เพชรบุรี",
    [["CCS2", 120, 2], ["Type 2", 22, 2]],
    { price: 7.5, open24: true, rating: 4.3, reviews: 63, amenities: ["restroom", "cafe", "restaurant", "convenience"], photo: 7, dLat: -0.51, dLng: 0.043 }),
  mk("st-054", "แม่สอด ทาวน์ เซ็นเตอร์", "pea-volta", "tak", "ถ.อินทรคีรี ต.แม่สอด อ.แม่สอด ตาก",
    [["CCS2", 120, 1], ["Type 2", 22, 2]],
    { price: 6.8, hours: "08:00 – 20:00 น.", rating: 4.0, reviews: 22, amenities: ["restroom", "convenience", "freeParking"], photo: 8, dLat: -0.17, dLng: -0.55 }),
];

/* ────────── helper ────────── */

export const stationById = Object.fromEntries(
  stations.map((s) => [s.id, s]),
) as Record<string, Station>;

export function maxKw(s: Station) {
  return Math.max(...s.connectors.map((c) => c.kw));
}

export function speedTier(s: Station): SpeedTier {
  const kw = maxKw(s);
  if (kw >= 150) return "ultra";
  if (kw >= 50) return "dc";
  return "ac";
}

export const speedLabels: Record<SpeedTier, string> = {
  ac: "AC ปกติ",
  dc: "DC Fast",
  ultra: "Ultra Fast",
};

export function totalPlugs(s: Station) {
  return s.connectors.reduce((n, c) => n + c.total, 0);
}

export function connectorTypes(s: Station): ConnectorType[] {
  return [...new Set(s.connectors.map((c) => c.type))];
}

export function stationsInProvince(provinceId: string) {
  return stations.filter((s) => s.provinceId === provinceId);
}

export function stationsInRegion(region: RegionId) {
  return stations.filter((s) => s.region === region);
}

/** ตัวเลขสรุปที่ใช้ทั้งบนแผนที่และใน section "ตัวเลขความน่าเชื่อถือ" */
export const stationStats = {
  stations: stations.length,
  plugs: stations.reduce((n, s) => n + totalPlugs(s), 0),
  provinces: new Set(stations.map((s) => s.provinceId)).size,
  networks: new Set(stations.map((s) => s.network)).size,
};

export const priceRange = {
  min: Math.min(...stations.map((s) => s.pricePerKwh)),
  max: Math.max(...stations.map((s) => s.pricePerKwh)),
};
