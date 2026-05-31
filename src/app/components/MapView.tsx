import { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Landmark,
  Calendar,
  Palette,
  Filter,
  Loader,
  TypeIcon,
  Search,
  X,
} from "lucide-react";
import { CulturalPoint, typeIcons } from "../types/place";
import { renderToString } from "react-dom/server";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isUserNearPlace } from "../utils/geo";
import { handleLocalType } from "./LocalDetails";

const DEFAULT_CENTER: [number, number] = [-30.033, -51.222];
const MAP_STATE_KEY = "cultpoa-map-state";
const MAP_FILTER_KEY = "cultpoa-map-filter";

export function MapView() {
  const [selectedFilter, setSelectedFilter] = useState<string>(() => {
    try {
      return localStorage.getItem(MAP_FILTER_KEY) || "all";
    } catch {
      return "all";
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [culturalPoints, setCulturalPoints] = useState<CulturalPoint[]>([]);
  const [followUser, setFollowUser] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [nearbyPlace, setNearbyPlace] = useState<CulturalPoint | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const savedMapState = (() => {
    try {
      return JSON.parse(localStorage.getItem(MAP_STATE_KEY) || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMapReady(true);

      import("leaflet/dist/leaflet.css");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MAP_FILTER_KEY, selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        const { api } = await import("../services/api");
        const places = await api.getAllPlaces();
        setCulturalPoints(places);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => console.error("Erro de geolocalização:", err),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!userPosition || culturalPoints.length === 0) {
      setNearbyPlace(null);
      return;
    }

    const nearby = culturalPoints.find((place) =>
      isUserNearPlace(userPosition, place),
    );

    setNearbyPlace(nearby ?? null);
  }, [userPosition, culturalPoints]);

  const filters = [
    { id: "all", label: "Todos", icon: MapPin },
    { id: "museum", label: "Museus", icon: Building2 },
    { id: "monument", label: "Monumentos", icon: Landmark },
    { id: "artwork", label: "Arte", icon: Palette },
  ];

  const filteredPoints =
    selectedFilter === "all"
      ? culturalPoints
      : culturalPoints.filter((p) => p.type === selectedFilter);

  const handleMarkerClick = (id) => {
    navigate(`/local/${id}`);
  };

  if (!mapReady) {
    return (
      <div className="relative w-full h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-[#E63946]" />
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const searchResults = culturalPoints.filter((place) =>
    normalizeText(place.name).includes(normalizeText(searchTerm)),
  );

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm shadow-md p-4">
        <div className="flex items-center">
          <h1 className='font-["Dongle"] text-[#E63946] font-bold text-4xl'>
            Cultpoa
          </h1>

          <div className="flex-1" />

          <button
            onClick={() => setShowSearch((v) => !v)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showSearch && (
          <div className="mt-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar local cultural..."
                className="w-full pl-10 pr-10 py-2 border rounded-xl bg-white"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        )}

        {searchTerm.trim() && (
          <div className="absolute top-32 left-4 right-4 z-[1200] max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            {searchResults.length === 0 ? (
              <div className="p-4 text-gray-500">Nenhum local encontrado.</div>
            ) : (
              searchResults.map((place) => (
                <button
                  key={place.id}
                  onClick={() => navigate(`/local/${place.id}`)}
                  className="w-full p-4 border-b last:border-b-0 text-left hover:bg-gray-50"
                >
                  <div className="flex gap-3">
                    {place.image && (
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{place.name}</h3>

                      <p className="text-sm text-gray-500 line-clamp-2">
                        {place.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{handleLocalType(place.type)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedFilter === filter.id
                    ? "bg-[#E63946] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-0 mt-28">
        <LeafletMap
          culturalPoints={filteredPoints}
          userPosition={userPosition}
          followUser={followUser}
          initialCenter={
            savedMapState?.center
              ? [savedMapState.center.lat, savedMapState.center.lng]
              : DEFAULT_CENTER
          }
          initialZoom={savedMapState?.zoom || 15}
          onMapMove={() => setFollowUser(false)}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <button
        onClick={() => setFollowUser(true)}
        className="fixed bottom-22 right-4 z-[1000] w-14 h-14 bg-[#2A9D8F] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#238276] transition-colors"
      >
        <MapPin className="w-6 h-6" />
      </button>

      {isLoading && (
        <div className="fixed top-32 left-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin text-[#E63946]" />
          <span className="text-sm text-gray-700">Carregando pontos...</span>
        </div>
      )}
    </div>
  );
}

function LeafletMap({
  culturalPoints,
  userPosition,
  followUser,
  initialCenter,
  initialZoom,
  onMapMove,
  onMarkerClick,
}: {
  culturalPoints: CulturalPoint[];
  userPosition: { lat: number; lon: number } | null;
  followUser: boolean;
  initialCenter: [number, number];
  initialZoom: number;
  onMapMove: () => void;
}) {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    const loadMap = async () => {
      const [
        { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents },
        { default: MarkerClusterGroup },
        L,
      ] = await Promise.all([
        import("react-leaflet"),
        import("react-leaflet-cluster"),
        import("leaflet"),
      ]);

      const userIcon = new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64," +
          btoa(`
            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2A9D8F" stroke="white" stroke-width="3"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
          `),
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });

      const createPlaceIcon = (type) => {
        const Icon = typeIcons[type] || MapPin;

        const iconHtml = renderToString(React.createElement(Icon));

        return new L.DivIcon({
          html: iconHtml,
          className:
            "text-gray-700 hover:bg-gray-100 bg-white rounded-full p-2 shadow",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
      };

      function ChangeView({
        center,
        follow,
      }: {
        center: [number, number];
        follow: boolean;
      }) {
        const map = useMap();
        useEffect(() => {
          if (follow) {
            map.setView(center, 15, { animate: true });
          }
        }, [center, follow, map]);
        return null;
      }

      function MapEvents() {
        useMapEvents({
          dragstart: onMapMove,
          zoomstart: onMapMove,
        });
        return null;
      }

      setMapComponents({
        MapContainer,
        TileLayer,
        Marker,
        Popup,
        MarkerClusterGroup,
        ChangeView,
        MapEvents,
        userIcon,
        createPlaceIcon,
        PersistMapState,
      });

      function PersistMapState() {
        const map = useMapEvents({
          moveend: () => {
            const center = map.getCenter();

            localStorage.setItem(
              MAP_STATE_KEY,
              JSON.stringify({
                center: {
                  lat: center.lat,
                  lng: center.lng,
                },
                zoom: map.getZoom(),
              }),
            );
          },
          zoomend: () => {
            const center = map.getCenter();

            localStorage.setItem(
              MAP_STATE_KEY,
              JSON.stringify({
                center: {
                  lat: center.lat,
                  lng: center.lng,
                },
                zoom: map.getZoom(),
              }),
            );
          },
        });

        return null;
      }
    };

    loadMap();
  }, [onMapMove]);

  if (!MapComponents) {
    return (
      <div className="w-full h-full bg-[#F1FAEE] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#E63946]" />
      </div>
    );
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    MarkerClusterGroup,
    ChangeView,
    MapEvents: MapEventsComponent,
    PersistMapState,
    userIcon,
    createPlaceIcon,
  } = MapComponents;

  const mapCenter =
    userPosition && followUser
      ? ([userPosition.lat, userPosition.lon] as [number, number])
      : DEFAULT_CENTER;

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <MapEventsComponent />
      <PersistMapState />

      {userPosition && (
        <>
          <ChangeView center={mapCenter} follow={followUser} />
          <Marker
            position={[userPosition.lat, userPosition.lon]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-medium">Você está aqui</p>
              </div>
            </Popup>
          </Marker>
        </>
      )}

      <MarkerClusterGroup
        disableClusteringAtZoom={17}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        chunkedLoading
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();

          return L.divIcon({
            html: `
        <div class="flex items-center justify-center w-12 h-12 bg-white rounded-full font-bold font-2xl text-gray-600 shadow">
          ${count}
        </div>
      `,
            className: "",
            iconSize: [40, 40],
          });
        }}
      >
        {culturalPoints.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lon]}
            icon={createPlaceIcon(place.type)}
            eventHandlers={{
              click: () => onMarkerClick(place.id),
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
