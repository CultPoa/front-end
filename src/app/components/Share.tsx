import { useRef, useState } from "react";
import { Camera, Instagram, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function Share() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleSelectImage = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    handleSelectImage(file);
  };

  const handleCopyHashtag = async () => {
    await navigator.clipboard.writeText("#cultpoa");

    setCopied(true);

    toast.success("Hashtag copiada");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const generateStoryImage = async () => {
    if (!preview) return null;

    try {
      const response = await fetch(preview);
      const imageBlob = await response.blob();

      const bitmap = await createImageBitmap(imageBlob);

      const MAX_WIDTH = 1080;
      const MAX_HEIGHT = 1920;

      let width = bitmap.width;
      let height = bitmap.height;

      const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);

      width = Math.floor(width * scale);
      height = Math.floor(height * scale);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        bitmap.close();
        return null;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(bitmap, 0, 0, width, height);

      const gradientHeight = canvas.height * 0.28;

      const gradient = ctx.createLinearGradient(
        0,
        canvas.height - gradientHeight,
        0,
        canvas.height,
      );

      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, "rgba(0,0,0,0.72)");

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        canvas.height - gradientHeight,
        canvas.width,
        gradientHeight,
      );

      ctx.fillStyle = "#FFFFFF";

      ctx.font = "bold 64px sans-serif";

      ctx.fillText("#cultpoa", 180, canvas.height - 120);

      ctx.font = "32px sans-serif";

      ctx.fillText("📍 Porto Alegre", 180, canvas.height - 60);

      const finalBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9,
        );
      });

      bitmap.close();

      canvas.width = 0;
      canvas.height = 0;

      return finalBlob;
    } catch {
      return null;
    }
  };

  const handleShareInstagram = async () => {
    if (!imageFile) return;

    setSharing(true);

    try {
      const blob = await generateStoryImage();

      if (!blob) {
        toast.error("Erro ao gerar imagem");
        return;
      }

      const file = new File([blob], "cultpoa-story.jpg", {
        type: "image/jpeg",
      });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          text: "#cultpoa",
          title: "Compartilhe sua experiência",
        });

        toast.success("Story pronto para compartilhar");
      } else {
        toast.error("Compartilhamento não suportado");
      }
    } catch {
      toast.error("Erro ao compartilhar");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <h1 className='font-["Dongle"] text-[#E63946] font-bold text-4xl'>
          Compartilhe
        </h1>
        <p className="text-sm text-gray-600">
          Publique sua experiência nas redes sociais.
        </p>
      </div>
      <div className="max-w-md mx-auto px-5 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          {!preview ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full"
            >
              <div className="flex flex-col items-center justify-center py-14 px-6 border-2 border-dashed border-[#E63946]/25 rounded-2xl hover:border-[#E63946]/50 transition-colors">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#F4A261] flex items-center justify-center mb-5">
                  <Camera className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-lg text-gray-900 mb-2">Criar imagem</h2>

                <p className="text-sm text-gray-500 text-center max-w-[240px]">
                  Tire uma foto ou escolha uma imagem da galeria.
                </p>
              </div>
            </button>
          ) : (
            <div>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full aspect-[9/16] object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-3xl font-bold">#cultpoa</p>

                  <p className="text-white/90 text-sm mt-1">📍 Porto Alegre</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareInstagram}
                  disabled={sharing}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Instagram className="w-5 h-5" />

                  <span>
                    {sharing
                      ? "Preparando Story..."
                      : "Compartilhar no Instagram"}
                  </span>
                </motion.button>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopyHashtag}
                    className="flex-1 h-14 rounded-2xl bg-[#2A9D8F] text-white flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}

                    <span>{copied ? "Copiado" : "Copiar hashtag"}</span>
                  </button>

                  <button
                    onClick={() => inputRef.current?.click()}
                    className="h-14 px-5 rounded-2xl bg-gray-100 text-gray-700"
                  >
                    Trocar
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-6 bg-[#E63946]/8 border border-[#E63946]/15 rounded-2xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Utilize a{" "}
            <span className="font-semibold text-[#E63946]">#cultpoa</span> para
            participar da comunidade e compartilhar lugares culturais de Porto
            Alegre!
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
