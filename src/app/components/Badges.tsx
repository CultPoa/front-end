<<<<<<< HEAD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Lock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { BadgeCard } from "./BadgeCard";
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Lock, MapPin, Calendar } from "lucide-react";
import { motion } from "motion/react";
>>>>>>> origin/main

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
  unlockedAt?: string;
  locationId?: string;
  color: string;
}

const badges: Badge[] = [
  {
    id: "1",
    name: "Explorador Cultural",
    description: "Visite seu primeiro local cultural",
    image: "🎨",
    unlocked: true,
    unlockedAt: "20 de Abril, 2026",
    locationId: "1",
    color: "#E63946",
  },
  {
    id: "2",
    name: "Conhecedor de Museus",
    description: "Visite 3 museus diferentes",
    image: "🏛️",
    unlocked: false,
    color: "#F4A261",
  },
  {
    id: "3",
    name: "Guardião da História",
    description: "Visite todos os monumentos históricos",
    image: "🗿",
    unlocked: false,
    color: "#2A9D8F",
  },
  {
    id: "4",
    name: "Amante das Artes",
    description: "Participe de 5 eventos culturais",
    image: "🎭",
    unlocked: false,
    color: "#E76F51",
  },
  {
    id: "5",
    name: "Curador POA",
    description: "Deixe mensagens em 10 locais diferentes",
    image: "📝",
    unlocked: false,
    color: "#264653",
  },
  {
    id: "6",
    name: "Influencer Cultural",
    description: "Compartilhe 20 fotos no Instagram",
    image: "📸",
    unlocked: false,
    color: "#E63946",
  },
];

export function Badges() {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-10">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <h1 className='font-["Dongle"] text-[#E63946] font-bold text-5xl'>
              Minhas Insígnias
            </h1>
            <p className="text-sm text-gray-600">
              {unlockedCount} de {badges.length} conquistadas
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {badges.map((badge, index) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
<<<<<<< HEAD
              className="cursor-pointer"
            >
              <BadgeCard
                badge={badge}
                index={index}
                onSelect={() => setSelectedBadge(badge)}
              />
            </div>
=======
              className={`relative p-6 rounded-2xl transition-all ${
                badge.unlocked
                  ? "bg-white shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#E63946]/20"
                  : "bg-gray-100 opacity-60"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={`text-5xl ${!badge.unlocked && "grayscale blur-sm"}`}
                >
                  {badge.image}
                </div>

                <div className="space-y-1">
                  <h3 className="text-gray-900">{badge.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                {badge.unlocked && badge.unlockedAt && (
                  <div className="flex items-center gap-1 text-xs text-[#2A9D8F]">
                    <Calendar className="w-3 h-3" />
                    <span>{badge.unlockedAt}</span>
                  </div>
                )}

                {!badge.unlocked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </motion.button>
>>>>>>> origin/main
          ))}
        </div>
      </div>

      {selectedBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedBadge(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`text-7xl ${!selectedBadge.unlocked && "grayscale blur-sm"}`}
              >
                {selectedBadge.image}
              </div>

              <h2 className="text-gray-900">{selectedBadge.name}</h2>
              <p className="text-gray-600">{selectedBadge.description}</p>

              {selectedBadge.unlocked ? (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-center gap-2 text-[#2A9D8F]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Conquistada em {selectedBadge.unlockedAt}
                    </span>
                  </div>
                  {selectedBadge.locationId && (
                    <button
                      onClick={() => {
                        setSelectedBadge(null);
                        navigate(`/local/${selectedBadge.locationId}`);
                      }}
                      className="w-full py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#D62839] transition-colors"
                    >
                      Ver local
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full p-4 bg-gray-100 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">
                      Continue explorando para desbloquear
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
