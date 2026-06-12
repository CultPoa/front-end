import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { getProgress } from "../utils/progress";
import { getBadges, Badge } from "../utils/badges";


export function Badges() {

  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const progress = getProgress();
    const userBadges = getBadges(progress);

    setBadges(userBadges);
  }, []);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-10">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <h1 className='font-["Dongle"] text-[#E63946] font-bold text-4xl'>
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
            <motion.button
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedBadge(badge)}
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
                  {badge.name.split(" ")[0]}
                </div>

                <div className="space-y-1">
                  <h3 className="text-gray-900">
                    {badge.name.substring(2)}
                  </h3>

                  <p className="text-xs text-gray-600">
                    {badge.description}
                  </p>

                  <p className="text-xs text-[#E63946] font-medium">
                    {badge.progress}/{badge.goal}
                  </p>
                </div>

                {!badge.unlocked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </motion.button>
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
                {selectedBadge.name.split(" ")[0]}
              </div>

              <h2 className="text-gray-900">{selectedBadge.name.substring(2)}</h2>
              <p className="text-gray-600">{selectedBadge.description}</p>

              <p className="text-sm font-medium text-[#E63946]">
                Progresso: {selectedBadge.progress}/{selectedBadge.goal}
              </p>

              {selectedBadge.unlocked ? (
                <div className="w-full p-4 bg-green-100 rounded-xl">
                  <p className="text-green-700 text-sm">
                    🎉 Insígnia conquistada!
                  </p>
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
