import { motion } from 'motion/react';
import { Navigation, Loader } from 'lucide-react';

interface MapControlsProps {
  onCenterUser: () => void;
  isLoading?: boolean;
  nearbyPlaceName?: string;
}

export function MapControls({ onCenterUser, isLoading, nearbyPlaceName }: MapControlsProps) {
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCenterUser}
        className="fixed bottom-24 right-4 z-[1000] w-14 h-14 bg-[#2A9D8F] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#238276] transition-colors"
      >
        <Navigation className="w-6 h-6" />
      </motion.button>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <Loader className="w-4 h-4 animate-spin text-[#E63946]" />
          <span className="text-sm text-gray-700">Carregando pontos...</span>
        </motion.div>
      )}

      {nearbyPlaceName && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-[#2A9D8F] text-white px-6 py-3 rounded-xl shadow-xl"
        >
          <p className="text-sm">📍 Você está perto de: <strong>{nearbyPlaceName}</strong></p>
        </motion.div>
      )}
    </>
  );
}
