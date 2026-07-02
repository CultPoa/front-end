import { Place, CulturalPoint, typeColors } from "../types/place";
import { Badge } from "../types/badges";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface BadgesResponse {
  readonly total: number;
  readonly unlocked: number;
  readonly badges: Badge[];
}

interface UnlockBadgeResponse {
  readonly success: boolean;
  readonly [key: string]: unknown;
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

let placesCache: CulturalPoint[] | null = null;
let placesMapCache: Map<string, CulturalPoint> | null = null;

function mapPlace(el: Place): CulturalPoint {
  return {
    id: el.id,
    name: el.name || "Sem nome",
    lat: el.lat,
    lon: el.lon,
    lng: el.lon,
    type: el.type,
    description: el.description,
    image:
      el.image ||
      (el.wikipedia
        ? `https://commons.wikimedia.org/wiki/Special:FilePath/${el.wikipedia}`
        : undefined),
    wikipedia: el.wikipedia || undefined,
    website: el.website || undefined,
    color: typeColors[el.type] || "#2A9D8F",
  };
}

export const api = {
  async getAllPlaces(): Promise<CulturalPoint[]> {
    if (placesCache) return placesCache;

    const res = await fetch(`${API_BASE_URL}/places`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Place[] = await res.json();
    const mapped: CulturalPoint[] = data.map(mapPlace);

    placesCache = mapped;
    placesMapCache = new Map(mapped.map((place) => [place.id, place]));
    return mapped;
  },

  async getPlaceById(id: string): Promise<CulturalPoint> {
    if (placesMapCache?.has(id)) {
      return placesMapCache.get(id)!;
    }

    const res = await fetch(`${API_BASE_URL}/places/?place_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Place = await res.json();
    const mapped = mapPlace(data);

    if (!placesMapCache) placesMapCache = new Map();
    placesMapCache.set(mapped.id, mapped);
    if (placesCache) placesCache.push(mapped);

    return mapped;
  },

  async getUserBadges(): Promise<BadgesResponse> {
    const token = localStorage.getItem("auth");

    if (!token) throw new Error("auth");

    const res = await fetch(`${API_BASE_URL}/badge`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: BadgesResponse = await res.json();
    return data;
  },

  async unlockBadge(placeId: string): Promise<UnlockBadgeResponse> {
    const token = localStorage.getItem("auth");

    if (!token) throw new Error("auth");

    const res = await fetch(`${API_BASE_URL}/badge`, {
      method: "POST",
      body: JSON.stringify({ placeId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return res.json();
  },
};
