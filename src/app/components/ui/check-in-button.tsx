import { useState } from "react";
import { api } from "../../services/api";

type CheckInButtonProps = {
  placeId: string;
};

export function CheckInButton({ placeId }: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      await api.unlockBadge(placeId);
      setIsUnlocked(true);
    } catch (error) {
      console.error("Erro ao desbloquear insígnia:", error);
      alert("Não foi possível desbloquear a insígnia.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={isLoading || isUnlocked}
      className={`w-full mt-4 px-4 py-3 rounded-lg font-medium transition-colors ${
        isUnlocked
          ? "bg-green-600 text-white"
          : "bg-[#E63946] text-white hover:bg-[#d62839]"
      }`}
    >
      {isLoading
        ? "Desbloqueando..."
        : isUnlocked
        ? "Insígnia desbloqueada ✓"
        : "Fazer check-in"}
    </button>
  );
}