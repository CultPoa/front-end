import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Loader2, ExternalLink, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";

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
    dateObj: d,
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

interface CalendarViewProps {
  events: Event[];
  loading: boolean;
}

export function CalendarView({ events, loading }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get all dates that have events
  const datesWithEvents = useMemo(() => {
    const dates = new Set<string>();
    events.forEach((event) => {
      const date = new Date(event.start_date);
      dates.add(date.toISOString().split("T")[0]);
    });
    return dates;
  }, [events]);

  // Filter events for selected date
  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];

    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    return events.filter((event) => {
      const eventDateStr = new Date(event.start_date)
        .toISOString()
        .split("T")[0];
      return eventDateStr === selectedDateStr;
    });
  }, [selectedDate, events]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="lg:w-80 flex-shrink-0">
          <Card className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-[#E63946]" />
              <h3 className="font-semibold text-gray-800">Selecione um dia</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                // Disable dates in the past
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="w-full"
            />
            {selectedDate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    {selectedDate.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {eventsOnSelectedDate.length === 0
                    ? "Nenhum evento"
                    : `${eventsOnSelectedDate.length} evento${
                        eventsOnSelectedDate.length > 1 ? "s" : ""
                      }`}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Events Section */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p>Carregando eventos...</p>
            </div>
          ) : selectedDate ? (
            <div>
              <div className="mb-6">
                <h2 className='font-["Dongle"] text-gray-700 font-bold text-4xl mb-2'>
                  {selectedDate.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-gray-500">
                  {eventsOnSelectedDate.length === 0
                    ? "Nenhum evento programado para este dia"
                    : `${eventsOnSelectedDate.length} evento${
                        eventsOnSelectedDate.length > 1 ? "s" : ""
                      } programado${eventsOnSelectedDate.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {eventsOnSelectedDate.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200"
                  >
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Nenhum evento encontrado para este dia.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Escolha outra data para explorar eventos
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="events"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {eventsOnSelectedDate.map((event, index) => {
                      const { date, time } = parseStartDate(event.start_date);
                      const locationText = formatLocation(event.location);

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="overflow-hidden rounded-[28px] bg-white border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="relative h-48 overflow-hidden bg-gray-100">
                            <img
                              src={event.images.lg || event.images.original}
                              alt={event.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity =
                                  "0";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>

                          <div className="p-5">
                            <div className="flex items-start gap-2 mb-3">
                              <Clock className="w-4 h-4 text-[#E63946] flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600 font-medium">
                                {time}
                              </p>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-3">
                              {sanitizeEventName(event.name)}
                            </h3>

                            <div className="flex items-start gap-2 mb-5">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600">
                                {locationText}
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-11 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center text-sm font-medium active:scale-[0.98] transition-transform hover:bg-[#237b6f]"
                              >
                                Acessar evento
                              </a>

                              <a
                                href={buildGoogleCalendarUrl(event)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-11 px-4 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                                title="Adicionar ao Google Calendar"
                              >
                                <Bookmark className="w-4 h-4 text-gray-700" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
