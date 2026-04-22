import { useState } from 'react';
import { ArrowLeft, Plus, Edit, CheckCircle, Clock, Eye, AlertCircle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Content {
  id: string;
  title: string;
  type: 'local' | 'event';
  status: 'pending' | 'approved' | 'rejected';
  author: string;
  date: string;
  version: number;
}

const pendingContent: Content[] = [
  {
    id: '1',
    title: 'Novo evento: Workshop de Fotografia',
    type: 'event',
    status: 'pending',
    author: 'Usuário da comunidade',
    date: '22 de Abril, 2026',
    version: 1,
  },
  {
    id: '2',
    title: 'Atualização: MARGS - Nova exposição',
    type: 'local',
    status: 'pending',
    author: 'Curador',
    date: '21 de Abril, 2026',
    version: 2,
  },
];

export function Admin() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved'>('pending');

  const handleApprove = (id: string) => {
    toast.success('Conteúdo aprovado!', {
      description: 'O conteúdo agora está visível para todos os usuários.',
    });
  };

  const handleReject = (id: string) => {
    toast.error('Conteúdo rejeitado', {
      description: 'O autor será notificado sobre a rejeição.',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="bg-gradient-to-br from-[#264653] to-[#2A9D8F] text-white p-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-white">Painel Administrativo</h1>
            <p className="text-sm text-white/80">Gestão de conteúdo</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              selectedTab === 'pending'
                ? 'bg-white text-[#264653]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Pendentes ({pendingContent.length})</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              selectedTab === 'approved'
                ? 'bg-white text-[#264653]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Aprovados</span>
            </div>
          </button>
        </div>
      </div>

      <div className="p-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mb-6 py-4 bg-[#E63946] text-white rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#D62839] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Criar novo conteúdo</span>
        </motion.button>

        {selectedTab === 'pending' ? (
          <div className="space-y-4">
            {pendingContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-[#F4A261]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{content.title}</h3>
                      {content.version > 1 && (
                        <span className="px-2 py-0.5 bg-[#2A9D8F]/10 text-[#2A9D8F] text-xs rounded-full">
                          v{content.version}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Por {content.author} • {content.date}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#F4A261]/10 text-[#F4A261] text-xs rounded-full">
                    {content.type === 'local' ? 'Local' : 'Evento'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">Aguardando revisão</p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Visualizar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    <span>Histórico</span>
                  </motion.button>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(content.id)}
                    className="flex-1 py-3 bg-[#2A9D8F] text-white rounded-xl hover:bg-[#238276] transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Aprovar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(content.id)}
                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Rejeitar
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {pendingContent.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">Tudo em dia!</h3>
                <p className="text-gray-600">Não há conteúdos pendentes para revisar.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#2A9D8F]" />
            </div>
            <h3 className="text-gray-900 mb-2">Conteúdos aprovados</h3>
            <p className="text-gray-600">
              Todos os conteúdos aprovados estão visíveis no aplicativo com o selo de curadoria.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E63946]/5 rounded-xl p-4 text-center">
                <p className="text-3xl text-[#E63946] mb-1">24</p>
                <p className="text-sm text-gray-600">Locais ativos</p>
              </div>
              <div className="bg-[#2A9D8F]/5 rounded-xl p-4 text-center">
                <p className="text-3xl text-[#2A9D8F] mb-1">18</p>
                <p className="text-sm text-gray-600">Eventos ativos</p>
              </div>
              <div className="bg-[#F4A261]/5 rounded-xl p-4 text-center">
                <p className="text-3xl text-[#F4A261] mb-1">156</p>
                <p className="text-sm text-gray-600">Mensagens</p>
              </div>
              <div className="bg-[#264653]/5 rounded-xl p-4 text-center">
                <p className="text-3xl text-[#264653] mb-1">1.2k</p>
                <p className="text-sm text-gray-600">Usuários</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="mb-1">Controle de permissões ativo</p>
                <p className="text-xs text-gray-600">
                  Você tem acesso total como administrador. Curadores podem aprovar conteúdos, mas não gerenciar usuários.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
