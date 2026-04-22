import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface ChangeViewProps {
  center: [number, number];
  follow: boolean;
  zoom?: number;
}

export function ChangeView({ center, follow, zoom = 15 }: ChangeViewProps) {
  const map = useMap();

  useEffect(() => {
    if (follow) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, follow, zoom, map]);

  return null;
}
