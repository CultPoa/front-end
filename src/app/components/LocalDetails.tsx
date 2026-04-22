import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Info, BadgeCheck, Camera, Share2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Place } from '../types/place';

const handleLocalType = (local: string): string => {
  const types_names: Record<string, string> = {
    artwork: 'Obra de Arte',
    museum: 'Museu',
    monument: 'Monumento',
    event: 'Evento',
  };

  return types_names[local] ?? local;
};

export function LocalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visited, setVisited] = useState(false);
  const [local, setLocal] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setIsLoading(true);
        const { api } = await import('../services/api');
        const data = await api.getPlaceById(id!);
        setLocal(data);
      } catch (error) {
        console.error('Erro ao carregar local:', error);
        toast.error('Erro ao carregar informações do local');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPlace();
    }
  }, [id]);

  const images = local?.image ? [local.image] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!local) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">Local não encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#D62839] transition-colors"
          >
            Voltar ao mapa
          </button>
        </div>
      </div>
    );
  }

  const handleRegisterVisit = () => {
    setVisited(true);
    toast.success('Visita registrada!', {
      description: 'Você ganhou uma nova insígnia! 🏅',
      action: {
        label: 'Ver insígnias',
        onClick: () => navigate('/insignias'),
      },
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="relative">
        <div className="relative h-80 overflow-hidden bg-gray-200">
          {images.length > 0 && (
            <>
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[currentImageIndex]}
                alt={local.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => toast.info('Recurso de compartilhamento em breve!')}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="px-6 py-6 pb-30">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-1">
            <h1 className="text-[#E63946] mb-1 font-bold">{local.name}</h1>
            <p className="text-gray-600">{handleLocalType(local.type)}</p>
          </div>
          {visited && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full"
            >
              <BadgeCheck className="w-4 h-4" />
              <span className="text-sm">Visitado</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {local.website && (
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-[#F4A261] flex-shrink-0 mt-0.5" />
              <a
                href={local.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E63946] hover:underline"
              >
                Visitar website oficial
              </a>
            </div>
          )}
        </div>

        <div className="bg-[#2A9D8F]/5 border border-[#2A9D8F]/20 rounded-xl p-2 mb-6 text-center ">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-[#2A9D8F]" />
            <span className="text-[#2A9D8F]">Conteúdo validado por curadores</span>
          </div>
        </div>

        {local.description && (
          <div className="mb-6">
            <h2 className="text-gray-900 mb-3">Sobre o local</h2>
            <p className="text-gray-700 leading-relaxed text-justify">{local.description}</p>
          </div>
        )}

        {local.wikipedia && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">Mais informações</h3>
              </div>
              <a
                href={`https://wikipedia.org/wiki/${local.wikipedia}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Ver artigo na Wikipedia
              </a>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-0 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRegisterVisit}
              disabled={visited}
              className={`flex-1 py-4 rounded-xl transition-all ${
                visited
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#E63946] text-white shadow-lg hover:bg-[#D62839]'
              }`}
            >
              {visited ? 'Visita já registrada' : 'Registrar visita'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/compartilhar')}
              className="w-14 h-14 bg-[#F4A261] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#E89351] transition-colors"
            >
              <Camera className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
