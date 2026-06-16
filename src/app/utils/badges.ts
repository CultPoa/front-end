import { UserProgress } from "./progress";

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  goal: number;
}

export function getBadges(progress: UserProgress): Badge[] {
  return [
    {
      id: "explorer",
      name: "🧭 Explorador Cultural",
      description: "Visite seu primeiro local cultural",
      unlocked: progress.placesVisited.length >= 1,
      progress: progress.placesVisited.length,
      goal: 1,
    },
    {
      id: "museum",
      name: "🏛️ Conhecedor de Museus",
      description: "Visite 3 museus diferentes",
      unlocked: progress.museumsVisited.length >= 3,
      progress: progress.museumsVisited.length,
      goal: 3,
    },
    {
      id: "art",
      name: "🎨 Amante das Artes",
      description: "Participe de 3 eventos culturais",
      unlocked: progress.eventsAttended.length >= 3,
      progress: progress.eventsAttended.length,
      goal: 3,
    },
    {
      id: "curator",
      name: "✉️ Curador POA",
      description: "Deixe mensagens em 10 locais diferentes",
      unlocked: progress.secretMessages.length >= 10,
      progress: progress.secretMessages.length,
      goal: 10,
    },
    {
      id: "influencer",
      name: "📸 Influenciador Cultural",
      description: "Compartilhe 20 fotos no Instagram",
      unlocked: progress.photosShared >= 20,
      progress: progress.photosShared,
      goal: 20,
    },
    {
      id: "guardian",
      name: "🗿 Guardião da História",
      description: "Visite 10 monumentos",
      unlocked: progress.monumentsVisited.length >= 10,
      progress: progress.monumentsVisited.length,
      goal: 10,
    },
  ];
}