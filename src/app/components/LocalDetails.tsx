import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Info,
  BadgeCheck,
  Camera,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Map,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Place } from "../types/place";
import { haversineDistance, isUserNearPlace } from "../utils/geo";
import { checkInPlace, getProgress } from "../utils/progress";
import { getBadges } from "../utils/badges";

export const handleLocalType = (type: string): string => {
  const typesNames: Record<string, string> = {
    museum: "Museu",
    monument: "Monumento",
    event: "Evento",
    art: "Arte",
  };

  return typesNames[type] ?? type;
};

export function LocalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [local, setLocal] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNear, setIsNear] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);
  const [badges, setBadges] = useState(() => {
    const progress = getProgress();
    return getBadges(progress);
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setIsLoading(true);
        const { api } = await import("../services/api");
        const data = await api.getPlaceById(id!);
        setLocal(data);
      } catch (error) {
        console.error("Erro ao carregar local:", error);
        toast.error("Erro ao carregar informações do local");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPlace();
    }
  }, [id]);

  useEffect(() => {
    if (!local || !navigator.geolocation) {
      setCheckingLocation(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        console.log("📍 Your GPS:", userPosition);
        console.log("🏛️ Place GPS:", {
          lat: local.lat,
          lon: local.lon,
          name: local.name,
        });

        const near = isUserNearPlace(userPosition, local);

        const distance = haversineDistance(
          userPosition.lat,
          userPosition.lon,
          local.lat,
          local.lon
        );

        console.log("📏 Distance:", distance.toFixed(2), "meters");
        console.log("🚶 Is near?", near);

        setIsNear(near);
        setCheckingLocation(false);
      },
      (error) => {
        console.error("Erro de localização:", error);
        setCheckingLocation(false);
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [local]);

  const images = local?.image ? [local.image] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!local) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">Local não encontrado</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#D62839] transition-colors"
          >
            Voltar ao mapa
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  function handleGoogleSearch(): string {
    if (!local) {
      return "";
    }

    const handledType = handleLocalType(local.type);
    const nameLower = local.name.toLowerCase();

    const nameContainsType = nameLower.includes(handledType.toLowerCase());

    const typeAndName = nameContainsType
      ? local.name
      : `${handledType} ${local.name}`;

    const hasPortoAlegre = typeAndName.toLowerCase().includes("porto alegre");

    return hasPortoAlegre ? typeAndName : `${typeAndName} Porto Alegre`;
  }
  function handleCheckIn() {
    if (!local) return;

    if (!isNear) {
      toast.error("❌ Você precisa se aproximar para fazer check-in.");
      return;
    }

    const progress = checkInPlace(local);

    setBadges(getBadges(progress));

    console.log("🏆 Novo progresso:", progress);

    toast.success("🏆 Check-in realizado com sucesso!");
  }
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-between px-4 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => toast.info("Recurso de compartilhamento em breve!")}
          className="pointer-events-auto w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="relative h-[42vh] overflow-hidden bg-gray-100">
        {images.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[currentImageIndex]}
              alt={local.name}
              className="w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </>
        )}

        <div
          className={`absolute inset-0 ${
            images.length > 0
              ? "bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              : "bg-gradient-to-t from-black/40 via-black/5 to-transparent"
          }`}
        />

        <div className="absolute bottom-8 left-6 right-6">
          <p className="text-white/90 tracking-wide font-['Dongle'] text-3xl">
            {handleLocalType(local.type)}
          </p>

          <h1 className="text-2xl font-bold text-white leading-tight">
            {local.name}
          </h1>
        </div>
      </div>

      <div className="relative z-10 -mt-6 bg-[#FAFAFA] rounded-t-[32px] px-6 py-8 pb-32">
        <div className="space-y-8">
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-300">
            <h3 className="font-bold mb-2">
              🏆 Badge Debug
            </h3>

            {badges.map((badge) => (
              <div key={badge.id} className="text-sm mb-2">
                {badge.unlocked ? "✅" : "🔒"}{" "}
                {badge.name} ({badge.progress}/{badge.goal})
              </div>
            ))}
          </div>
          {/* Temporary geolocation status */}
          <div className="p-4 rounded-xl bg-white shadow-sm">
            {checkingLocation ? (
              <p>📍 Verificando sua localização...</p>
            ) : isNear ? (
              <p className="text-green-600">
                ✅ Você está próximo deste local!
              </p>
            ) : (
              <p className="text-red-600">
                ❌ Você precisa se aproximar para fazer check-in.
              </p>
            )}
          </div>

          <button
            onClick={handleCheckIn}
            disabled={!isNear}
            className={`
              w-full py-3 rounded-xl font-semibold transition-colors
              ${
                isNear
                  ? "bg-[#E63946] text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
          >
            🏆 Fazer Check-in
          </button>

          <div className="overflow-x-auto no-scrollbar w-full">
            <div className="flex gap-3 w-max pr-6">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${local.lat},${local.lon}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 h-11 px-4 rounded-full border border-gray-200 bg-white flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Map className="w-4 h-4" />
                Abrir no Maps
              </a>

              {local.website && (
                <a
                  href={local.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 h-11 px-4 rounded-full border border-gray-200 bg-white flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}

              {local.wikipedia && (
                <a
                  href={`https://wikipedia.org/wiki/${local.wikipedia}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 h-11 px-4 rounded-full border border-gray-200 bg-white flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  Wikipedia
                </a>
              )}

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  handleGoogleSearch(),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 h-11 px-4 rounded-full border border-gray-200 bg-white flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Search className="w-4 h-4" />
                Pesquisar
              </a>
            </div>
          </div>

          {local.description && (
            <div>
              <h2 className="text-xs uppercase tracking-wide text-gray-400 mb-4">
                Sobre
              </h2>

              <p className="text-[15px] leading-8 text-gray-700 text-justify">
                {local.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
