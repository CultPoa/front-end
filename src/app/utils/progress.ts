import { Place } from "../types/place";

const PROGRESS_KEY = "cultpoa-progress";

export interface UserProgress {
  placesVisited: string[];
  museumsVisited: string[];
  monumentsVisited: string[];
  eventsAttended: string[];
  secretMessages: string[];
  photosShared: number;
}

const defaultProgress: UserProgress = {
  placesVisited: [],
  museumsVisited: [],
  monumentsVisited: [],
  eventsAttended: [],
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
      return { ...defaultProgress };
    }

    const parsed = JSON.parse(saved);

    if (!isValidProgress(parsed)) {
      console.warn("Invalid progress data detected. Resetting progress.");

      localStorage.removeItem(PROGRESS_KEY);

      return { ...defaultProgress };
    }

    return {
      ...defaultProgress,
      ...parsed,
    };
  } catch (error) {
    console.error("Error loading progress:", error);

    return { ...defaultProgress };
  }
}
function isValidProgress(data: unknown): data is UserProgress {
  if (!data || typeof data !== "object") {
    return false;
  }

  const progress = data as UserProgress;

  return (
    Array.isArray(progress.placesVisited) &&
    Array.isArray(progress.museumsVisited) &&
    Array.isArray(progress.monumentsVisited) &&
    Array.isArray(progress.secretMessages) &&
    typeof progress.eventsAttended === "number" &&
    typeof progress.photosShared === "number"
  );
}
/**
 * Save progress to localStorage
 */
export function saveProgress(progress: UserProgress): boolean {
  try {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(progress)
    );

    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
}

/**
 * Add a check-in for a cultural place
 */
export function checkInPlace(place: Place) {
  if (!place.id || !place.type) {
    console.error("Invalid place for check-in", place);
    return getProgress();
  }

  const progress = getProgress();
  const id = String(place.id);

  if (!progress.placesVisited.includes(id)) {
    progress.placesVisited.push(id);
  }

  if (
    place.type === "museum" &&
    !progress.museumsVisited.includes(id)
  ) {
    progress.museumsVisited.push(id);
  }

  if (
    place.type === "monument" &&
    !progress.monumentsVisited.includes(id)
  ) {
    progress.monumentsVisited.push(id);
  }

const success = saveProgress(progress);

  if (!success) {
    console.error("Failed to save check-in progress");
  }

  return progress;
}

/**
 * Count attendance at cultural events
 */
export function addEventParticipation(eventId: string) {
  const progress = getProgress();

  if (!progress.eventsAttended.includes(eventId)) {
    progress.eventsAttended.push(eventId);
  }

  const success = saveProgress(progress);

  if (!success) {
    console.error("Failed to save event participation");
  }

  return progress;
}

/**
 * Track secret messages left at locations
 * Only counts unique locations
 */
export function addSecretMessage(placeId: string) {
  if (!placeId) {
    console.error("Missing placeId for secret message");
    return getProgress();
  }

  const progress = getProgress();

  if (!progress.secretMessages.includes(placeId)) {
    progress.secretMessages.push(placeId);
  }
  const success = saveProgress(progress);

  if (!success) {
    console.error("Failed to save secret message progress");
  }

  return progress;

}

/**
 * Track social media shares
 */
export function addPhotoShare() {
  const progress = getProgress();

  progress.photosShared = Math.max(0, progress.photosShared) + 1;

  const success = saveProgress(progress);

  if (!success) {
    console.error("Failed to save photo sharing progress");
  }

  return progress;
}

/**
 * Reset progress (useful during development)
 */
export function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}