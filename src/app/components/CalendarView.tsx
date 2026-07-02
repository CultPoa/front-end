import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Loader2,
  Bookmark,
  Sparkles,
} from "lucide-react";
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
    weekday: d
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", ""),
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const datesWithEvents = useMemo(() => {
    const dates = new Set<string>();
    events.forEach((event) => {
      const date = new Date(event.start_date);
      dates.add(date.toISOString().split("T")[0]);
    });
    return dates;
  }, [events]);

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
    <div className="space-y-6 rounded-3xl">
      <div className="flex flex-col lg:flex-row gap-6 p-1">
        {/* Sidebar: calendário + resumo do dia */}
        <div className="lg:w-80 flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-5 bg-white rounded-[28px] border border-[#EDE4D3] shadow-[0_8px_30px_-12px_rgba(38,33,28,0.15)] overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E63946]/10">
                <CalendarIcon className="w-4 h-4 text-[#E63946]" />
              </span>
              <div>
                <h3 className="font-semibold text-[#26211C] text-base">
                  Selecione um dia
                </h3>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              modifiers={{
                hasEvents: (date) =>
                  datesWithEvents.has(date.toISOString().split("T")[0]),
              }}
              modifiersClassNames={{
                hasEvents:
                  "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#E63946]",
              }}
              className="w-full"
            />

            {/* Canhoto do dia selecionado */}
            {selectedDate && (
              <div className="mt-5 relative rounded-2xl bg-[#26211C] text-[#FAF6EF] px-4 py-4 flex items-center gap-4 overflow-hidden">
                <span
                  className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF6EF]"
                  aria-hidden="true"
                />
                <span
                  className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF6EF]"
                  aria-hidden="true"
                />
                <div
                  className="font-['Dongle'] leading-none text-5xl font-bold text-[#E9B44C]"
                  aria-hidden="true"
                >
                  {String(selectedDate.getDate()).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-[#FAF6EF]/70">
                    {selectedDate.toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm font-medium text-[#FAF6EF] mt-0.5">
                    {eventsOnSelectedDate.length === 0
                      ? "Nenhum evento"
                      : `${eventsOnSelectedDate.length} evento${eventsOnSelectedDate.length > 1 ? "s" : ""} programado${eventsOnSelectedDate.length > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Conteúdo: lista de eventos */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-4" aria-busy="true" aria-live="polite">
              <span className="sr-only">Carregando eventos…</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-[28px] bg-white border border-[#EDE4D3] overflow-hidden animate-pulse flex"
                >
                  <div className="w-48 h-full bg-[#F1EAD9] flex-shrink-0" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-3 w-20 bg-[#F1EAD9] rounded-full" />
                    <div className="h-4 w-3/4 bg-[#F1EAD9] rounded-full" />
                    <div className="h-3 w-1/2 bg-[#F1EAD9] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <div>
              <div className="mb-6">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#E63946] uppercase mb-1 flex items-center gap-1.5"></p>
                <h2 className="font-['Dongle'] text-[#26211C] font-bold text-5xl leading-none mb-2">
                  {selectedDate.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-[#7A7266]">
                  {eventsOnSelectedDate.length === 0
                    ? "Nenhum evento programado para este dia"
                    : `Há ${eventsOnSelectedDate.length} evento${eventsOnSelectedDate.length > 1 ? "s" : ""} programado${eventsOnSelectedDate.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {eventsOnSelectedDate.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 bg-white rounded-[28px] border border-dashed border-[#DDD2BB]"
                  >
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F1EAD9] mb-4">
                      <CalendarIcon className="w-6 h-6 text-[#B8AB8C]" />
                    </span>
                    <p className="text-[#26211C] font-medium">
                      Nada marcado para este dia
                    </p>
                    <p className="text-sm text-[#9C9080] mt-1">
                      Escolha outra data no calendário para ver a agenda
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
                      const { time, weekday } = parseStartDate(
                        event.start_date,
                      );
                      const locationText = formatLocation(event.location);

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group flex flex-col sm:flex-row rounded-[28px] bg-white border border-[#EDE4D3] hover:shadow-[0_12px_36px_-14px_rgba(38,33,28,0.22)] transition-shadow overflow-hidden"
                        >
                          {/* Imagem + selo de horário */}
                          <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-[#F1EAD9]">
                            <img
                              src={event.images.lg || event.images.original}
                              alt={event.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity =
                                  "0";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                            <div
                              className="absolute top-3 left-3 bg-[#E9B44C] text-[#26211C] rounded-lg px-2.5 py-1 -rotate-3 shadow-md"
                              aria-hidden="true"
                            >
                              <p className="font-['Dongle'] font-bold text-xl leading-none">
                                {time}
                              </p>
                              <p className="text-[9px] font-semibold uppercase tracking-wide leading-none mt-0.5">
                                {weekday}
                              </p>
                            </div>
                          </div>

                          {/* Linha de perfuração (canhoto de ingresso) */}
                          <div className="relative hidden sm:block w-px bg-transparent">
                            <div className="absolute inset-y-3 left-0 border-l-2 border-dashed border-[#EDE4D3]" />
                            <span
                              className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-[#FAF6EF]"
                              aria-hidden="true"
                            />
                            <span
                              className="absolute -bottom-2.5 -left-2.5 w-5 h-5 rounded-full bg-[#FAF6EF]"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 p-5 flex flex-col">
                            <div className="flex items-center gap-1.5 mb-2 sm:hidden text-[#E63946]">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-xs font-semibold">
                                {time}
                              </span>
                            </div>

                            <h3 className="text-lg font-semibold text-[#26211C] leading-snug mb-2.5">
                              {sanitizeEventName(event.name)}
                            </h3>

                            <div className="flex items-start gap-2 mb-4 text-[#7A7266]">
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#9C9080]" />
                              <p className="text-sm">{locationText}</p>
                            </div>

                            <div className="flex gap-3 mt-auto pt-4 border-t border-dashed border-[#EDE4D3]">
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-11 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center text-sm font-medium active:scale-[0.98] transition-transform hover:bg-[#237b6f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A9D8F]"
                              >
                                Acessar evento
                              </a>

                              <a
                                href={buildGoogleCalendarUrl(event)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-11 px-4 rounded-full border border-[#EDE4D3] bg-white flex items-center justify-center hover:bg-[#FAF6EF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26211C]"
                                title="Adicionar ao Google Calendar"
                                aria-label="Adicionar ao Google Calendar"
                              >
                                <Bookmark className="w-4 h-4 text-[#26211C]" />
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
