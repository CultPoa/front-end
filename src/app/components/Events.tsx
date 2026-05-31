import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  ExternalLink,
  Loader2,
  Bookmark,
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

function sanitizeEventName(name: string): string {
  return name
    .replace(/\b\d{1,2}[./-]\d{1,2}([./-]\d{2,4})?\b/g, "")
    .replace(/\b\d{1,2}\s+de\s+\w+\s+de\s+\d{4}\b/gi, "")
    .replace(/[|/\\\-–—:]{2,}/g, " ")
    .replace(/^[\s|/\\\-–—:]+/, "")
    .replace(/[\s|/\\\-–—:]+$/, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function buildGoogleCalendarUrl(event: Event) {
  const start = new Date(event.start_date);

  const end = new Date(start);
  end.setHours(end.getHours() + 3);

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]|\.\d{3}/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: event.url,
    location: formatLocation(event.location),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://www.sympla.com.br/api/discovery-bff/search/category-type?service=%2Fv4%2Fsearch%2Fquery&only=name,start_date,end_date,images,event_type,duration_type,location,id,global_score,start_date_formats,end_date_formats,url,company,type,organizer&has_banner=1&themes=99&sort=day-trending-score&formats=80,87,89&type=normal&city=Porto+Alegre&limit=10&location=Porto+Alegre&page=1&dt=&p=",

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
      <div className="sticky top-0 bg-[#FAFAFA]/80 backdrop-blur-md z-20 border-b border-black/5">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className='font-["Dongle"] text-[#E63946] font-bold text-5xl leading-none'>
            Eventos
          </h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-8">
        <a
          href="https://www.sympla.com.br/eventos/porto-alegre-rs"
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden rounded-[32px] p-7 text-white block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F] via-[#238276] to-[#1f6e64]" />

          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold leading-tight mb-3 max-w-xs">
              Eventos em Porto Alegre
            </h2>

            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Descubra shows, festas, exposições e experiências culturais na
              cidade.
            </p>

            <div className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-[#2A9D8F] font-medium">
              Explorar eventos
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </a>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-['Dongle'] text-gray-700 font-bold text-5xl">
                Bombando no momento
              </h2>

              <p className="text-m text-gray-500">
                Os dez eventos mais populares da semana!
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />

              <p>Buscando eventos em Porto Alegre...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {events.map((event, index) => {
                const { date, time } = parseStartDate(event.start_date);
                const locationText = formatLocation(event.location);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="overflow-hidden rounded-[28px] bg-white border border-gray-200"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img
                        src={event.images.lg || event.images.original}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-500 mb-2">
                        {date} • {time}
                      </p>

                      <h2 className="text-xl font-semibold text-gray-800 leading-tight mb-4">
                        {sanitizeEventName(event.name)}
                      </h2>

                      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                        {locationText}
                      </p>

                      <div className="flex gap-3">
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-11 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center text-sm font-medium active:scale-[0.98] transition-transform"
                        >
                          Acessar evento
                        </a>

                        <a
                          href={buildGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-11 px-4 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-gray-700" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
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
