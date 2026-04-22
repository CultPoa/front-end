import { useState, useEffect } from 'react';
import { CulturalPoint } from '../types/place';

interface Position {
  lat: number;
  lng: number;
}

const NEARBY_THRESHOLD_METERS = 100;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function useNearbyPlaces(
  userPosition: Position | null,
  places: CulturalPoint[]
) {
  const [nearbyPlace, setNearbyPlace] = useState<CulturalPoint | null>(null);

  useEffect(() => {
    if (!userPosition || places.length === 0) {
      setNearbyPlace(null);
      return;
    }

    const nearby = places.find((place) => {
      const distance = calculateDistance(
        userPosition.lat,
        userPosition.lng,
        place.lat,
        place.lng
      );
      return distance <= NEARBY_THRESHOLD_METERS;
    });

    setNearbyPlace(nearby || null);
  }, [userPosition, places]);

  return nearbyPlace;
}
