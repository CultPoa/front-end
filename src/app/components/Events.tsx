import { useState } from 'react';
import { Calendar, MapPin, Clock, Filter, Plus, ExternalLink, BadgeCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  source: 'official' | 'community';
  image: string;
  description: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Exposição: Arte Contemporânea Gaúcha',
    date: '2026-04-25',
    time: '14:00',
    location: 'MARGS',
    category: 'Exposição',
    source: 'official',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01c3d90?w=800',
    description: 'Uma celebração da arte contemporânea produzida no Rio Grande do Sul.',
  },
  {
    id: '2',
    title: 'Festival de Jazz POA 2026',
    date: '2026-05-10',
    time: '19:00',
    location: 'Theatro São Pedro',
    category: 'Música',
    source: 'official',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    description: 'O maior festival de jazz da região sul do Brasil.',
  },
  {
    id: '3',
    title: 'Caminhada Cultural Centro Histórico',
    date: '2026-04-28',
    time: '10:00',
    location: 'Praça da Matriz',
    category: 'Tour',
    source: 'community',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    description: 'Tour guiado pelos principais pontos históricos do centro de Porto Alegre.',
  },
  {
    id: '4',
    title: 'Oficina de Fotografia Urbana',
    date: '2026-05-05',
    time: '15:00',
    location: 'Casa de Cultura Mario Quintana',
    category: 'Workshop',
    source: 'community',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    description: 'Aprenda técnicas de fotografia urbana com profissionais.',
  },
];

export function Events() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showAddEvent, setShowAddEvent] = useState(false);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'official', label: 'Oficiais' },
    { id: 'community', label: 'Comunidade' },
  ];

  const filteredEvents = selectedFilter === 'all'
    ? events
    : events.filter(e => e.source === selectedFilter);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[#E63946]">Eventos Culturais</h1>
          <button
            onClick={() => setShowAddEvent(true)}
            className="w-10 h-10 bg-[#2A9D8F] text-white rounded-full flex items-center justify-center hover:bg-[#238276] transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedFilter === filter.id
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {event.source === 'official' ? (
                  <div className="flex items-center gap-1 bg-[#2A9D8F] text-white px-3 py-1 rounded-full text-xs">
                    <BadgeCheck className="w-3 h-3" />
                    <span>Oficial</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-[#F4A261] text-white px-3 py-1 rounded-full text-xs">
                    <Users className="w-3 h-3" />
                    <span>Comunidade</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-gray-900 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-[#E63946]" />
                  <span>{new Date(event.date).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-[#E63946]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-[#E63946]" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#D62839] transition-colors">
                  Salvar evento
                </button>
                <button className="w-12 h-12 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAddEvent(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-gray-900 mb-4">Adicionar Evento</h2>
            <p className="text-gray-600 mb-6">
              Contribua com a comunidade adicionando eventos culturais de Porto Alegre.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do evento"
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              <input
                type="time"
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              <input
                type="text"
                placeholder="Local"
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              <textarea
                placeholder="Descrição"
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none"
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 bg-[#2A9D8F] text-white rounded-xl hover:bg-[#238276] transition-colors"
                >
                  Enviar para análise
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
