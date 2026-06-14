import type { WallpaperPhoto } from "./types";
import { getCachedPhoto, saveCachedPhoto, savePrefetchedPhoto, promotePrefetch } from "./cache";
import { fetchRandomPhoto, triggerDownload } from "./unsplash";

interface WallpaperElements {
  container: HTMLElement;
  placeholder: HTMLImageElement;
  full: HTMLImageElement;
  attribution: HTMLElement;
}

/** Create the wallpaper DOM elements inside the existing #wallpaper div */
function createWallpaperDOM(): WallpaperElements {
  const container = document.getElementById("wallpaper")!;

  const placeholder = document.createElement("img");
  placeholder.id = "wallpaper-placeholder";
  placeholder.alt = "";

  const full = document.createElement("img");
  full.id = "wallpaper-full";
  full.alt = "";

  const attribution = document.createElement("div");
  attribution.id = "wallpaper-attribution";

  container.appendChild(placeholder);
  container.appendChild(full);
  container.appendChild(attribution);

  return { container, placeholder, full, attribution };
}

/** Update the attribution element with photographer info and required UTM links */
export function updateAttribution(el: HTMLElement, photo: WallpaperPhoto): void {
  el.innerHTML = `Photo by <a href="${photo.photographerUrl}?utm_source=new_tab&utm_medium=referral" target="_blank">${photo.photographerName}</a> on <a href="https://unsplash.com/?utm_source=new_tab&utm_medium=referral" target="_blank">Unsplash</a>`;
}

/** Display a photo with blurred placeholder and smooth fade-in */
async function displayPhoto(photo: WallpaperPhoto, elements: WallpaperElements): Promise<void> {
  // Set placeholder immediately (loads fast, shown blurred via CSS)
  elements.placeholder.src = photo.smallUrl;

  // Preload the full-resolution image
  const preload = new Image();
  preload.src = photo.fullUrl;

  preload.onload = (): void => {
    elements.full.src = photo.fullUrl;
    elements.full.classList.add("loaded");
  };

  preload.onerror = (): void => {
    console.warn("[wallpaper] Failed to load full-resolution image, keeping placeholder");
  };

  // Update attribution
  updateAttribution(elements.attribution, photo);
}

/** Prefetch the next wallpaper for future visits */
function prefetchNextWallpaper(): void {
  fetchRandomPhoto()
    .then((photo) => {
      savePrefetchedPhoto(photo);
      // Warm browser cache by preloading the full image
      const img = new Image();
      img.src = photo.fullUrl;
    })
    .catch((err) => {
      console.warn("[wallpaper] Prefetch failed:", err);
    });
}

/** Initialize the wallpaper system */
export async function initWallpaper(): Promise<void> {
  const elements = createWallpaperDOM();

  try {
    // Try to use a prefetched photo first, then fall back to cached
    let photo = promotePrefetch();
    if (!photo) {
      photo = getCachedPhoto();
    }

    if (photo) {
      // Use cached/promoted photo
      await displayPhoto(photo, elements);
      saveCachedPhoto(photo);
      triggerDownload(photo.downloadEndpoint);
      prefetchNextWallpaper();
    } else {
      // No cache — fetch fresh
      const freshPhoto = await fetchRandomPhoto();
      await displayPhoto(freshPhoto, elements);
      saveCachedPhoto(freshPhoto);
      triggerDownload(freshPhoto.downloadEndpoint);
      prefetchNextWallpaper();
    }
  } catch (err) {
    // Graceful fallback: dark background color is already set via CSS
    console.warn("[wallpaper] Initialization failed, showing fallback:", err);
  }
}
