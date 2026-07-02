import {
  MapPin,
  Calendar,
  Award,
  MessageCircle,
  User,
  ImageUp,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: MapPin, label: "Mapa" },
    { path: "/eventos", icon: Calendar, label: "Eventos" },
    { path: "/compartilhar", icon: ImageUp, label: "Fotos" },
    { path: "/insignias", icon: Award, label: "Coleção" },
    { path: "/mensagens", icon: MessageCircle, label: "Mensagem" },
    { path: "/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 px-4 py-2 flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#E63946]/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon
                className={`w-6 h-6 relative z-10 transition-colors ${
                  isActive ? "text-[#E63946]" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs relative z-10 transition-colors ${
                  isActive ? "text-[#E63946]" : "text-gray-500"
                }`}
              ></span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
