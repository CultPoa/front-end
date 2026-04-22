import { useMapEvents } from 'react-leaflet';

interface MapEventsProps {
  onMapMove?: () => void;
}

export function MapEvents({ onMapMove }: MapEventsProps) {
  useMapEvents({
    dragstart: () => {
      onMapMove?.();
    },
    zoomstart: () => {
      onMapMove?.();
    },
  });

  return null;
}
