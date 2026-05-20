import { Lock, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface BadgeCardProps {
  badge: {
    id: string;
    
    name: string;
    description: string;
    image: string;
    unlocked: boolean;
    unlockedAt?: string;
    locationId?: string;
    color: string;
  };
  index: number;
  onSelect: () => void;
}

export function BadgeCard({ badge, index, onSelect }: BadgeCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={`relative p-6 rounded-2xl transition-all ${
        badge.unlocked
          ? "bg-white shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#E63946]/20"
          : "bg-gray-100 opacity-60"
      }`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`text-5xl ${!badge.unlocked && "grayscale blur-sm"}`}>
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
  );
}