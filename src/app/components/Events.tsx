import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

interface EventLocation {
  name: string;
  city: string;
  state: string;
  neighborhood?: string;
}

interface Event {
  id: number;
  name: string;
  start_date: string;
  images: { lg: string; original: string };
  location: EventLocation;
  url: string;
}

function formatLocation(location: EventLocation): string {
  const parts = [
    location.name !== "Local a definir" ? location.name : null,
    location.neighborhood || null,
    location.city,
    location.state,
  ].filter(Boolean);
  return parts.join(", ");
}

function parseStartDate(isoDate: string) {
  const d = new Date(isoDate);
  return {
    date: d.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://www.sympla.com.br/api/discovery-bff/search/category-type?service=%2Fv4%2Fsearch%2Fquery&only=name,start_date,end_date,images,event_type,duration_type,location,id,global_score,start_date_formats,end_date_formats,url,company,type,organizer&has_banner=1&themes=99&sort=day-trending-score&formats=80,87,89&type=normal&city=Porto+Alegre&limit=24&location=Porto+Alegre&page=1&dt=&p=",

          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Sec-GPC": "1",
            },
            method: "GET",
          },
        );
        const data = await response.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <div className="flex items-center justify-between">
          <h1 className='font-["Dongle"] text-[#E63946] font-bold text-5xl'>
            Eventos
          </h1>
          <button
            onClick={() => setShowAddEvent(true)}
            className="w-10 h-10 bg-[#2A9D8F] text-white rounded-full flex items-center justify-center hover:bg-[#238276] transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Buscando eventos em Porto Alegre...</p>
          </div>
        ) : (
          events.map((event, index) => {
            const { date, time } = parseStartDate(event.start_date);
            const locationText = formatLocation(event.location);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#E63946] to-[#2A9D8F] flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Calendar className="w-16 h-16 text-white" />
                  </div>

                  <img
                    src={event.images.lg || event.images.original}
                    alt={event.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-gray-900 font-semibold mb-3 line-clamp-2 leading-tight">
                    {event.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#E63946]" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-[#E63946]" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-[#E63946]" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </div>

                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#E63946] text-white rounded-xl font-bold hover:bg-[#D62839] transition-all active:scale-[0.98]"
                  >
                    Acessar evento
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Evento</h2>
            <button
              onClick={() => setShowAddEvent(false)}
              className="w-full py-3 bg-gray-100 rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
