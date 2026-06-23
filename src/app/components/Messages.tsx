import { useState, useEffect } from "react";
import {
  Send,
  MessageCircle,
  AlertCircle,
  MapPin,
  Navigation,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { isUserNearPlace } from "../utils/geo";
import { CulturalPoint } from "../types/place";
import { Loader } from "lucide-react";
import {
  sendSecretMessage,
  fetchNewestMessage,
} from "../services/secretMessage";

interface Message {
  id: string;
  locationId: string;
  locationName: string;
  text: string;
  date: string;
}

const MOCK_PAST_MESSAGES: Message[] = [
  {
    id: "1",
    locationId: "1",
    locationName: "MARGS",
    text: "Este museu é incrível! A coleção de arte moderna é de tirar o fôlego.",
    date: "2026-04-20",
  },
  {
    id: "2",
    locationId: "2",
    locationName: "Casa de Cultura Mario Quintana",
    text: "Lugar perfeito para passar uma tarde. As exposições são sempre interessantes.",
    date: "2026-04-18",
  },
];

const getAuthToken = () => {
  return localStorage.getItem("auth");
};

export function Messages() {
  const navigate = useNavigate();

  const [messageText, setMessageText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [nearbyPlace, setNearbyPlace] = useState<CulturalPoint | null>(null);
  const [culturalPoints, setCulturalPoints] = useState<CulturalPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newestMessage, setNewestMessage] = useState<string | null>(null);
  const [isFetchingNewest, setIsFetchingNewest] = useState(false);

  const isAuthenticated = !!getAuthToken();

  const maxChars = 200;

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
    if (!userPosition || culturalPoints.length === 0) {
      setNearbyPlace(null);
      return;
    }

    const nearby = culturalPoints.find((place) =>
      isUserNearPlace(userPosition, { lat: place.lat, lon: place.lng }),
    );

    setNearbyPlace(nearby ?? null);
  }, [userPosition, culturalPoints]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) =>
        setUserPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      (err) => console.error("Erro de geolocalização:", err),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !nearbyPlace || !isAuthenticated) return;

    try {
      setIsSending(true);

      await sendSecretMessage(nearbyPlace.id, messageText.trim());

      toast.success("Mensagem enviada!", {
        description:
          "Sua mensagem será moderada antes de aparecer para outros usuários.",
      });

      setMessageText("");
      setShowForm(false);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("auth");

        toast.error("Sua sessão expirou.", {
          description: "Faça login novamente para continuar.",
        });

        setShowForm(false);
        setMessageText("");

        navigate("/login");

        return;
      }

      toast.error("Erro ao enviar mensagem", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFetchNewest = async () => {
    if (!nearbyPlace) return;

    try {
      setIsFetchingNewest(true);
      setNewestMessage(null);

      const data = await fetchNewestMessage(nearbyPlace.id);

      setNewestMessage(data?.content ?? "Nenhuma mensagem encontrada.");
    } catch (error: any) {
      if (error?.status === 401) {
        localStorage.removeItem("auth");

        toast.error("Sua sessão expirou.", {
          description: "Faça login novamente para continuar.",
        });

        navigate("/perfil");

        return;
      }

      toast.error("Não foi possível buscar a mensagem.");
    } finally {
      setIsFetchingNewest(false);
    }
  };

  useEffect(() => {
    setNewestMessage(null);
    setShowForm(false);
  }, [nearbyPlace]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <h1 className='font-["Dongle"] text-[#E63946] font-bold text-4xl'>
          Mensagens Secretas
        </h1>

        <p className="text-sm text-gray-600">Deixe sua marca nos locais</p>
      </div>

      <div className="p-4 space-y-6">
        <AnimatePresence mode="wait">
          {nearbyPlace ? (
            <motion.div
              key="nearby"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#2A9D8F]"
            >
              <div className="flex items-start gap-3 mb-4">
                <Navigation className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-gray-900 font-medium">
                    Você está próximo de{" "}
                    <span className="text-[#2A9D8F]">{nearbyPlace.name}</span>.
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Gostaria de deixar uma mensagem para o próximo usuário que
                    passar aqui?
                  </p>
                </div>
              </div>

              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 bg-[#E63946]/5 border border-[#E63946]/20 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-[#E63946] flex-shrink-0 mt-0.5" />

                    <div>
                      <p className="text-sm font-medium text-[#E63946]">
                        Faça login para comentar
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        Apenas usuários autenticados podem deixar mensagens nos
                        locais culturais.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {isAuthenticated && (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowForm(true)}
                          className="w-full py-3 bg-[#2A9D8F] text-white rounded-xl hover:bg-[#238276] transition-colors flex items-center justify-center gap-2 shadow"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Adicionar mensagem</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleFetchNewest}
                          disabled={isFetchingNewest}
                          className="w-full py-3 border border-[#2A9D8F] text-[#2A9D8F] rounded-xl hover:bg-[#2A9D8F]/5 transition-colors flex items-center justify-center gap-2"
                        >
                          {isFetchingNewest ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <MessageCircle className="w-4 h-4" />
                          )}

                          <span>Ver última mensagem aqui</span>
                        </motion.button>
                      </>
                    )}

                    <AnimatePresence>
                      {newestMessage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[#2A9D8F]/5 border border-[#2A9D8F]/20 rounded-xl p-4 overflow-hidden"
                        >
                          <p className="text-xs text-[#2A9D8F] mb-1 font-medium">
                            Última mensagem em {nearbyPlace.name}
                          </p>

                          <p className="text-gray-700 text-sm leading-relaxed">
                            {newestMessage}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <textarea
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(e.target.value.slice(0, maxChars))
                        }
                        placeholder="Compartilhe sua experiência..."
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none"
                        autoFocus
                      />

                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-sm ${
                            messageText.length >= maxChars
                              ? "text-[#E63946]"
                              : "text-gray-500"
                          }`}
                        >
                          {messageText.length}/{maxChars} caracteres
                        </span>

                        {messageText.length >= maxChars && (
                          <span className="text-xs text-[#E63946]">
                            Limite atingido
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#F4A261] flex-shrink-0 mt-0.5" />

                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          <li>Anônima por padrão</li>
                          <li>Moderada automaticamente</li>
                          <li>Apenas 1 mensagem ativa por local</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setMessageText("");
                        }}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || isSending}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                          messageText.trim() && !isSending
                            ? "bg-[#E63946] text-white hover:bg-[#D62839] shadow"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isSending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}

                        <span>{isSending ? "Enviando..." : "Enviar"}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="not-nearby"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-gray-900 font-medium">
                    Você não está em nenhum local
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Visite um ponto cultural do mapa para deixar uma mensagem
                    secreta para quem passar depois de você.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
