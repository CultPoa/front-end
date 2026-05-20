import { useState } from "react";
import { ArrowLeft, Camera, Instagram, Share2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";

export function Share() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const mockImages = [
    "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600",
    "https://images.unsplash.com/photo-1577083552431-6e5fd01c3d90?w=600",
    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600",
  ];

  const handleShare = (platform: string) => {
    toast.success(`Compartilhando no ${platform}!`, {
      description: "Não esqueça de usar #cultpoa",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4 pb-2">
        <div className="flex items-center gap-4">
          <h1 className='font-["Dongle"] text-[#E63946] font-bold text-5xl'>
            Minhas fotos
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        <div className="bg-gradient-to-br from-[#E63946] to-[#F4A261] rounded-2xl p-6 text-white">
          <h2 className="mb-2">Compartilhe sua experiência</h2>
          <p className="text-sm opacity-90">
            Tire uma foto do local que visitou e compartilhe nas redes sociais
            com a #cultpoa!
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E63946] to-[#F4A261] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 mb-1">Tirar foto</h3>
                <p className="text-sm text-gray-600">
                  Use a câmera do seu dispositivo
                </p>
              </div>
            </div>
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Fotos recentes</h3>
            <div className="grid grid-cols-3 gap-3">
              {mockImages.map((img, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(img)}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-gray-900 mb-4">Pré-visualização</h3>

              <div className="flex justify-center">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-100 h-58 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                    <p className="text-sm">#cultpoa #PortoAlegre</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("Instagram")}
                    className="w-full py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Compartilhar no Instagram</span>
                  </motion.button>
                </a>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("outras redes")}
                    className="flex-1 py-4 bg-[#2A9D8F] text-white rounded-xl flex items-center justify-center gap-2 hover:bg-[#238276] transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Outras redes</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 rounded-xl p-4">
            <h4 className="text-gray-900 mb-2">Dica</h4>
            <p className="text-sm text-gray-700">
              Use a hashtag <span className="text-[#E63946]">#cultpoa</span>{" "}
              para fazer parte da comunidade e aparecer no feed oficial do
              aplicativo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
