const CHECKINS_KEY = "cultpoa-checkins";

export function getCheckins(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CHECKINS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function hasCheckedIn(placeId: string): boolean {
  return getCheckins().includes(placeId);
}

export function saveCheckin(placeId: string) {
  const checkins = getCheckins();

  if (!checkins.includes(placeId)) {
    checkins.push(placeId);

    localStorage.setItem(
      CHECKINS_KEY,
      JSON.stringify(checkins)
    );
  }
}