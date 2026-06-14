import type { UnsplashApiResponse, WallpaperPhoto } from "./types";

// Replace with actual Unsplash API key or configure via environment variable
const UNSPLASH_ACCESS_KEY_FALLBACK = "YOUR_UNSPLASH_ACCESS_KEY";

/** Get the configured Unsplash access key */
function getAccessKey(): string {
  return import.meta.env.VITE_UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY_FALLBACK;
}

/** Compute the optimal image width based on screen resolution and pixel ratio */
export function getScreenWidth(): number {
  const width = Math.round(window.screen.width * window.devicePixelRatio);
  return Math.min(width, 3840);
}

/** Fetch a random landscape nature photo from Unsplash */
export async function fetchRandomPhoto(): Promise<WallpaperPhoto> {
  const accessKey = getAccessKey();
  const width = getScreenWidth();

  const response = await fetch(
    "https://api.unsplash.com/photos/random?orientation=landscape&query=nature",
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    }
  );

  if (response.status === 429) {
    throw new Error("Unsplash API rate limit exceeded");
  }

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as UnsplashApiResponse;

  // Validate required fields
  if (!data.id || !data.urls?.raw || !data.urls?.small || !data.user?.name) {
    throw new Error("Unsplash API response is missing required fields");
  }

  const fullUrl = `${data.urls.raw}&w=${width}&q=80&fit=clamp&auto=format`;
  const smallUrl = data.urls.small;

  return {
    id: data.id,
    fullUrl,
    smallUrl,
    photographerName: data.user.name,
    photographerUrl: data.user.links.html,
    unsplashUrl: data.links.html,
    downloadEndpoint: data.links.download_location,
    fetchedAt: Date.now(),
  };
}

/** Trigger Unsplash download tracking (fire-and-forget per API guidelines) */
export async function triggerDownload(downloadEndpoint: string): Promise<void> {
  try {
    const accessKey = getAccessKey();
    await fetch(downloadEndpoint, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });
  } catch {
    // Silently ignore errors — this is fire-and-forget
  }
}
