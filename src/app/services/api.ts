import { Place, CulturalPoint, typeColors } from '../types/place';

const API_BASE_URL = 'http://localhost:8000/api';

let placesCache: CulturalPoint[] | null = null;

export const api = {
  async getAllPlaces(): Promise<CulturalPoint[]> {
    if (placesCache) return placesCache;

    const res = await fetch(`${API_BASE_URL}/places`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Place[] = await res.json();

    const mapped: CulturalPoint[] = data.map((el) => ({
      id: el.id,
      name: el.name || 'Sem nome',
      lat: el.lat,
      lon: el.lon,
      type: el.type,
      description: el.description,
      image:
        el.image ||
        (el.wikipedia
          ? `https://commons.wikimedia.org/wiki/Special:FilePath/${el.wikipedia}`
          : undefined),
      wikipedia: el.wikipedia || undefined,
      website: el.website || undefined,
      color: typeColors[el.type] || '#2A9D8F',
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Place = await res.json();
    return data;
  },
};