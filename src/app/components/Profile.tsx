import { useState } from 'react';
import { User, Award, MapPin, Calendar, Settings, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export function Profile() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const stats = [
    { label: 'Locais visitados', value: '12', icon: MapPin, color: '#E63946' },
    { label: 'Insígnias', value: '5', icon: Award, color: '#F4A261' },
    { label: 'Eventos salvos', value: '8', icon: Calendar, color: '#2A9D8F' },
  ];

  const activities = [
    { id: '1', type: 'visit', text: 'Visitou MARGS', date: '20 de Abril' },
    { id: '2', type: 'badge', text: 'Conquistou "Explorador Cultural"', date: '20 de Abril' },
    { id: '3', type: 'message', text: 'Deixou mensagem no MARGS', date: '20 de Abril' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="bg-gradient-to-br from-[#E63946] to-[#F4A261] pt-12 pb-24 px-4">
        <div className="flex justify-end mb-8">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              <User className="w-12 h-12 text-[#E63946]" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2A9D8F] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#238276] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-white mb-1">Explorador Cultural</h2>
          <p className="text-white/80 text-sm">Membro desde Março 2026</p>

          {isAdmin && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => navigate('/admin')}
              className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Painel Administrativo
            </motion.button>
          )}
        </div>
      </div>

      <div className="-mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-gray-900 mb-4">Atividade recente</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 bg-[#E63946] rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E63946]/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-[#E63946]" />
              </div>
              <span className="text-gray-700">Minhas conquistas</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4A261]/10 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#F4A261]" />
              </div>
              <span className="text-gray-700">Configurações</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-gray-700">Sair</span>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500">
            CultPOA v1.0.0 • Feito com ❤️ em Porto Alegre
          </p>
        </div>
      </div>
    </div>
  );
}
