import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { CulturalPoint } from "../../types/place";
import { useWikipedia } from "../../hooks/useWikipedia";
import { ExternalLink } from "lucide-react";

const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface PlaceMarkerProps {
  place: CulturalPoint;
}

const getWikiUrl = (value: string): string => {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://pt.wikipedia.org/wiki/${encodeURIComponent(value)}`;
};

export function PlaceMarker({ place }: PlaceMarkerProps) {
  const navigate = useNavigate();
  const { cache, fetchWikipediaData } = useWikipedia();

  const handleClick = async () => {
    if (!place.wikipedia) return;

    const title = place.wikipedia.split(":")[1] || place.wikipedia;
    await fetchWikipediaData(title);
  };

  const wikiTitle = place.wikipedia?.split(":")[1] || place.wikipedia;
  const wikiData = wikiTitle ? cache[wikiTitle] : null;
  const image = place.image || wikiData?.image;
  const description = place.description || wikiData?.extract;

  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={createIcon(place.color)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup maxWidth={280} className="custom-popup">
        <div className="p-2">
          <h3 className="text-gray-900 mb-2">{place.name}</h3>

          {image && (
            <img
              src={image}
              alt={place.name}
              className="w-full rounded-lg mb-3"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}

          {description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
              {description}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/local/${place.id}`)}
              className="flex-1 px-4 py-2 bg-[#E63946] text-white rounded-lg text-sm hover:bg-[#D62839] transition-colors"
            >
              Ver detalhes
            </button>

            {place.wikipedia && wikiTitle && (
              <a
                href={getWikiUrl(wikiTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-700" />
              </a>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
