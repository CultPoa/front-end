// src/utils/geo.ts

const EARTH_RADIUS_METERS = 6371e3;
const DEFAULT_NEARBY_THRESHOLD_METERS = 100;

/**
 * Calcula a distância em metros entre duas coordenadas geográficas
 * usando a fórmula de Haversine.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Retorna true se o usuário estiver dentro do raio de proximidade de um place.
 *
 * @param userPosition  Coordenadas do usuário
 * @param place         Place com lat/lon
 * @param thresholdMeters  Raio em metros (padrão: 100m)
 */
export function isUserNearPlace(
  userPosition: { lat: number; lon: number },
  place: { lat: number; lon: number },
  thresholdMeters: number = DEFAULT_NEARBY_THRESHOLD_METERS,
): boolean {
  const distance = haversineDistance(
    userPosition.lat,
    userPosition.lon,
    place.lat,
    place.lon,
  );

  return distance <= thresholdMeters;
}
