/**
 * รูปทั้งหมดดึงจาก Unsplash (ID จริง ตรวจแล้วว่าโหลดได้)
 * หมายเหตุ: เว็บต้องต่ออินเทอร์เน็ตจึงจะเห็นรูป — ตามที่ตกลงกันไว้ในข้อ 19.4
 */
const U = "https://images.unsplash.com/";

export function unsplash(id: string, w = 800, h = 600) {
  return `${U}${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

/** สถานีชาร์จ / หัวชาร์จ */
export const stationPhotos = [
  "photo-1593941707874-ef25b8b4a92b",
  "photo-1593941707882-a5bba14938c7",
  "photo-1704475336842-0ab3798abf0e",
  "photo-1615829386703-e2bb66a7cb7d",
  "photo-1594535182308-8ffefbb661e1",
  "photo-1646753020826-c518face72ad",
  "photo-1671785253964-bdb43087ed99",
  "photo-1671782584185-1300064c5289",
  "photo-1617886322009-e02db73a70ee",
  "photo-1707758283398-7df21adba23a",
  "photo-1671782298320-5f4fe4ded064",
  "photo-1671782762232-217c587d7f1f",
  "photo-1607197109166-3ab4ee4b468f",
  "photo-1615901555268-839b7a1ede54",
  "photo-1607171028974-319ba56cb013",
];

/** งานติดตั้ง / ช่างไฟ / ตู้ควบคุม */
export const installPhotos = [
  "photo-1544724569-5f546fd6f2b5",
  "photo-1621905251189-08b45d6a269e",
  "photo-1635335874521-7987db781153",
  "photo-1660330589693-99889d60181e",
  "photo-1621905251918-48416bd8575a",
  "photo-1553873002-785d775854c9",
  "photo-1601462904263-f2fa0c851cb9",
  "photo-1615774925655-a0e97fc85c14",
  "photo-1676630656246-3047520adfdf",
  "photo-1660330589487-39cc0177ba89",
  "photo-1576446470246-499c738d1c8e",
  "photo-1607631697491-61972eecf928",
];

/** รถ EV / บรรยากาศทั่วไป — ใช้กับ hero และปกบทความ */
export const evPhotos = [
  "photo-1704340142770-b52988e5b6eb",
  "photo-1639302610362-4c86747e8680",
  "photo-1704475386627-dcfcd97ed51a",
  "photo-1666919643134-d97687c1826c",
  "photo-1571987502227-9231b837d92a",
  "photo-1567409378873-888d6fa7debc",
  "photo-1495435229349-e86db7bfa013",
];

export const stationPhoto = (i: number, w?: number, h?: number) =>
  unsplash(stationPhotos[i % stationPhotos.length], w, h);
export const installPhoto = (i: number, w?: number, h?: number) =>
  unsplash(installPhotos[i % installPhotos.length], w, h);
export const evPhoto = (i: number, w?: number, h?: number) =>
  unsplash(evPhotos[i % evPhotos.length], w, h);
