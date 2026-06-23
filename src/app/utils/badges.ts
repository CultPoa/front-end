import { UserProgress } from "./progress";

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  goal: number;
}
