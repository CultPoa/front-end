import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../services/api";
import { Badge } from "../types/badges";

type ErrorState = "auth" | "any" | null;

export function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [error, setError] = useState<ErrorState>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("auth");

    if (!token) {
      setError("auth");
      setLoading(false);
      return;
    }

    api
      .getUserBadges()
      .then((badgesResponse) => {
        setBadges(badgesResponse.badges);
        setUnlockedCount(badgesResponse.unlocked);
        setTotal(badgesResponse.total);
      })
      .catch((err) => {
        if (
          err?.message === "auth" ||
          err?.status === 401 ||
          err?.status === 403
        ) {
          localStorage.removeItem("auth");
          setError("auth");
          return;
        }
        setError("any");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const progressPercent = total > 0 ? (unlockedCount / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="px-4 pt-4 pb-3">
          <h1 className='font-["Dongle"] text-[#E63946] font-bold text-4xl leading-none'>
            Minhas Insígnias
          </h1>

          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mt-1 mb-2">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">
                    {unlockedCount}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-gray-800">{total}</span>{" "}
                  conquistadas
                </p>
                <span className="text-sm font-semibold text-[#E63946]">
                  {Math.round(progressPercent)}%
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] rounded-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        {loading && (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-gray-100 animate-pulse h-52"
              />
            ))}
          </div>
        )}

        {!loading && error === "auth" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-[#E63946]/5 border border-[#E63946]/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#E63946] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#E63946]">
                  Faça login para colecionar insígnias
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Apenas usuários autenticados podem colecionar insígnias.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && error === "any" && (
          <div className="text-center py-10">
            <span className="text-red-600 text-sm">
              Erro ao carregar insígnias.
            </span>
          </div>
        )}

        {!loading && !error && badges.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🏅</div>
            <h2 className="text-lg font-medium text-gray-900">
              Nenhuma insígnia encontrada
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xs">
              Você ainda não possui insígnias. Continue explorando para
              conquistar as primeiras.
            </p>
          </div>
        )}

        {!loading && !error && badges.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge, index) => (
              <motion.button
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={() => setSelectedBadge(badge)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all border ${
                  badge.unlocked
                    ? "bg-white border-[#E63946]/20 shadow-sm"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {/* Emoji / Icon area */}
                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full text-3xl ${
                      badge.unlocked
                        ? "bg-gradient-to-br from-[#E63946]/10 to-[#F4A261]/15"
                        : "bg-gray-200"
                    }`}
                  >
                    {badge.unlocked ? (
                      <span>🏆</span>
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={`font-semibold text-sm leading-tight ${
                        badge.unlocked ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {badge.name}
                    </h3>
                  </div>

                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5">
                      <span className="text-xs font-medium text-green-700">
                        Conquistada
                      </span>
                    </span>
                  ) : (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progresso</span>
                        <span className="font-medium text-[#E63946]">
                          {badge.progress}/{badge.goal}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((badge.progress / badge.goal) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
