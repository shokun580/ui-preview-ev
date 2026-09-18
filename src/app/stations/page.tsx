import type { Metadata } from "next";
import { StationsExplorer } from "@/components/stations/StationsExplorer";
import { provinceById } from "@/data/geo";

export const metadata: Metadata = {
  title: "ค้นหาสถานีชาร์จ",
  description:
    "ค้นหาสถานีชาร์จรถ EV ทั่วประเทศไทย เลือกดูจากแผนที่รายภาคและรายจังหวัด กรองตามหัวชาร์จ ความเร็ว ผู้ให้บริการ และสถานะว่าง",
};

export default async function StationsPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string }>;
}) {
  const { province } = await searchParams;
  const valid = province && provinceById[province] ? province : undefined;
  return <StationsExplorer initialProvince={valid} />;
}
