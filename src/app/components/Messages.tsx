import { useState } from 'react';
import { ArrowLeft, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Message {
  id: string;
  locationId: string;
  locationName: string;
  text: string;
  date: string;
  isOwn: boolean;
}

const messages: Message[] = [
  {
    id: '1',
    locationId: '1',
    locationName: 'MARGS',
    text: 'Este museu é incrível! A coleção de arte moderna é de tirar o fôlego.',
    date: '2026-04-20',
    isOwn: true,
  },
  {
    id: '2',
    locationId: '2',
    locationName: 'Casa de Cultura Mario Quintana',
    text: 'Lugar perfeito para passar uma tarde. As exposições são sempre interessantes.',
    date: '2026-04-18',
    isOwn: false,
  },
];

export function Messages() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const maxChars = 200;

  const handleSendMessage = () => {
    if (messageText.trim() && selectedLocation) {
      toast.success('Mensagem enviada!', {
        description: 'Sua mensagem será moderada antes de aparecer para outros usuários.',
      });
      setMessageText('');
      setSelectedLocation('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-[#E63946]">Mensagens Secretas</h1>
            <p className="text-sm text-gray-600">Deixe sua marca nos locais</p>
          </div>
          <MessageCircle className="w-8 h-8 text-[#F4A261]" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 mb-4">Deixar nova mensagem</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Local visitado</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              >
                <option value="">Selecione um local</option>
                <option value="1">MARGS</option>
                <option value="2">Casa de Cultura Mario Quintana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Sua mensagem</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value.slice(0, maxChars))}
                placeholder="Compartilhe sua experiência..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm ${
                  messageText.length >= maxChars ? 'text-[#E63946]' : 'text-gray-500'
                }`}>
                  {messageText.length}/{maxChars} caracteres
                </span>
                {messageText.length >= maxChars && (
                  <span className="text-xs text-[#E63946]">Limite atingido</span>
                )}
              </div>
            </div>

            <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F4A261] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="mb-1">Suas mensagens são:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Anônimas por padrão</li>
                    <li>Moderadas automaticamente</li>
                    <li>Apenas 1 mensagem ativa por local</li>
                  </ul>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!messageText.trim() || !selectedLocation}
              className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                messageText.trim() && selectedLocation
                  ? 'bg-[#E63946] text-white hover:bg-[#D62839] shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Enviar mensagem</span>
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-gray-900 px-2">Últimas mensagens deixadas</h2>

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-gray-900">{message.locationName}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(message.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {message.isOwn && (
                  <span className="px-3 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] text-xs rounded-full">
                    Sua mensagem
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">{message.text}</p>

              <button
                onClick={() => navigate(`/local/${message.locationId}`)}
                className="mt-4 text-sm text-[#E63946] hover:underline"
              >
                Ver local →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
