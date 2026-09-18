import type { AmenityId, ConnectorType, NetworkId, SpeedTier, Station } from "@/data/stations";
import { connectorTypes, speedTier } from "@/data/stations";
import { provinceById } from "@/data/geo";

export type Filters = {
  connectors: ConnectorType[];
  speeds: SpeedTier[];
  networks: NetworkId[];
  amenities: AmenityId[];
  open24: boolean;
  maxPrice: number | null;
};

export const emptyFilters: Filters = {
  connectors: [],
  speeds: [],
  networks: [],
  amenities: [],
  open24: false,
  maxPrice: null,
};

export function countActive(f: Filters) {
  return (
    f.connectors.length +
    f.speeds.length +
    f.networks.length +
    f.amenities.length +
    (f.open24 ? 1 : 0) +
    (f.maxPrice !== null ? 1 : 0)
  );
}

export function applyFilters(
  stations: Station[],
  {
    query,
    provinceId,
    region,
    filters,
  }: {
    query: string;
    provinceId: string | null;
    region: string | null;
    filters: Filters;
  },
) {
  const q = query.trim().toLowerCase();

  return stations.filter((s) => {
    if (provinceId && s.provinceId !== provinceId) return false;
    if (!provinceId && region && s.region !== region) return false;

    if (q) {
      const province = provinceById[s.provinceId];
      const haystack = [
        s.name,
        s.address,
        province?.name ?? "",
        province?.nameEn ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.connectors.length) {
      const types = connectorTypes(s);
      if (!filters.connectors.some((c) => types.includes(c))) return false;
    }
    if (filters.speeds.length && !filters.speeds.includes(speedTier(s))) return false;
    if (filters.networks.length && !filters.networks.includes(s.network)) return false;
    if (filters.amenities.length) {
      if (!filters.amenities.every((a) => s.amenities.includes(a))) return false;
    }
    if (filters.open24 && !s.open24) return false;
    if (filters.maxPrice !== null && s.pricePerKwh > filters.maxPrice) return false;

    return true;
  });
}

/* ไม่มีตัวเลือก "หัวว่างมากที่สุด" เพราะไม่ได้เก็บข้อมูลหัวที่ว่างอยู่ตอนนี้
   ถ้าต่อกับระบบของแต่ละเครือข่ายแบบเรียลไทม์ได้เมื่อไร ค่อยเพิ่มกลับมา */
export type SortKey = "recommended" | "distance" | "price" | "rating";

export const sortLabels: Record<SortKey, string> = {
  recommended: "แนะนำ",
  distance: "ใกล้ฉันที่สุด",
  price: "ราคาถูกที่สุด",
  rating: "คะแนนสูงสุด",
};
