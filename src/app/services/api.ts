import { Place, CulturalPoint, typeColors } from "../types/place";
import { Badge } from "../utils/badges";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

console.log(API_BASE_URL);

const getAuthToken = () => localStorage.getItem("access_token");

let placesCache: CulturalPoint[] | null = null;

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
    console.log("Places from API:", data);

    const mapped: CulturalPoint[] = data.map((el) => ({
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
    }));

    placesCache = mapped;
    return mapped;
  },

  async getPlaceById(id: string): Promise<Place> {
    if (placesCache) {
      const found = placesCache.find((p) => String(p.id) === String(id));
      if (found) return found as unknown as Place;
    }

    const res = await fetch(`${API_BASE_URL}/places/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Place = await res.json();

    console.log("API place types:", data.map(place => place.type));
    return data;
  },
async getUserBadges(): Promise<Badge[]> {
    const token = localStorage.getItem("auth");

    if (!token) throw new Error("No authentication token found.");

    const res = await fetch(`${API_BASE_URL}/badge`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    return data.badges;
  },

};
