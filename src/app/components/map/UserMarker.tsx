import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#2A9D8F" stroke="white" stroke-width="3"/>
      <circle cx="20" cy="20" r="8" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

interface UserMarkerProps {
  position: [number, number];
}

export function UserMarker({ position }: UserMarkerProps) {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-medium">Você está aqui</p>
        </div>
      </Popup>
    </Marker>
  );
}
