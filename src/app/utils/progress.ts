import { Place } from "../types/place";

const PROGRESS_KEY = "cultpoa-progress";

export interface UserProgress {
  placesVisited: string[];
  museumsVisited: string[];
  monumentsVisited: string[];
  eventsAttended: number;
  secretMessages: string[];
  photosShared: number;
}

const defaultProgress: UserProgress = {
  placesVisited: [],
  museumsVisited: [],
  monumentsVisited: [],
  eventsAttended: 0,
  secretMessages: [],
  photosShared: 0,
};

/**
 * Load progress from localStorage
 */
export function getProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);

    if (!saved) {
      return defaultProgress;
    }

    return {
      ...defaultProgress,
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.error("Error loading progress:", error);
    return defaultProgress;
  }
}

/**
 * Save progress to localStorage
 */
export function saveProgress(progress: UserProgress) {
  try {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

/**
 * Add a check-in for a cultural place
 */
export function checkInPlace(place: Place) {
  const progress = getProgress();

  const id = String(place.id);

  // Any cultural place counts toward Explorer
  if (!progress.placesVisited.includes(id)) {
    progress.placesVisited.push(id);
  }

  // Museum badge
  if (
    place.type === "museum" &&
    !progress.museumsVisited.includes(id)
  ) {
    progress.museumsVisited.push(id);
  }

  // History Guardian badge
  if (
    place.type === "monument" &&
    !progress.monumentsVisited.includes(id)
  ) {
    progress.monumentsVisited.push(id);
  }

  saveProgress(progress);

  return progress;
}

/**
 * Count attendance at cultural events
 */
export function addEventParticipation() {
  const progress = getProgress();

  progress.eventsAttended += 1;

  saveProgress(progress);

  return progress;
}

/**
 * Track secret messages left at locations
 * Only counts unique locations
 */
export function addSecretMessage(placeId: string) {
  const progress = getProgress();

  if (!progress.secretMessages.includes(placeId)) {
    progress.secretMessages.push(placeId);
  }

  saveProgress(progress);

  return progress;
}

/**
 * Track social media shares
 */
export function addPhotoShare() {
  const progress = getProgress();

  progress.photosShared += 1;

  saveProgress(progress);

  return progress;
}

/**
 * Reset progress (useful during development)
 */
export function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}