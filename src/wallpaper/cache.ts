import type { WallpaperPhoto } from "./types";

const CACHE_KEY_CURRENT = "wallpaper_current";
const CACHE_KEY_PREFETCH = "wallpaper_prefetch";

/** Retrieve the currently cached wallpaper photo */
export function getCachedPhoto(): WallpaperPhoto | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_CURRENT);
    if (!raw) return null;
    return JSON.parse(raw) as WallpaperPhoto;
  } catch {
    return null;
  }
}

/** Save a photo as the current wallpaper in cache */
export function saveCachedPhoto(photo: WallpaperPhoto): void {
  try {
    localStorage.setItem(CACHE_KEY_CURRENT, JSON.stringify(photo));
  } catch {
    // Silently ignore quota errors
  }
}

/** Retrieve the prefetched wallpaper photo */
export function getPrefetchedPhoto(): WallpaperPhoto | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFETCH);
    if (!raw) return null;
    return JSON.parse(raw) as WallpaperPhoto;
  } catch {
    return null;
  }
}

/** Save a photo to the prefetch slot */
export function savePrefetchedPhoto(photo: WallpaperPhoto): void {
  try {
    localStorage.setItem(CACHE_KEY_PREFETCH, JSON.stringify(photo));
  } catch {
    // Silently ignore quota errors
  }
}

/** Move the prefetched photo to current, clear prefetch slot */
export function promotePrefetch(): WallpaperPhoto | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFETCH);
    if (!raw) return null;
    const photo = JSON.parse(raw) as WallpaperPhoto;
    localStorage.setItem(CACHE_KEY_CURRENT, raw);
    localStorage.removeItem(CACHE_KEY_PREFETCH);
    return photo;
  } catch {
    return null;
  }
}
