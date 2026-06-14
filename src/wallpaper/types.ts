/** Cached photo metadata stored in localStorage */
export interface WallpaperPhoto {
  id: string;
  /** Full-resolution URL with Imgix params applied */
  fullUrl: string;
  /** Small/thumb URL for blur placeholder */
  smallUrl: string;
  /** Photographer's display name */
  photographerName: string;
  /** Link to photographer's Unsplash profile */
  photographerUrl: string;
  /** Link to the photo on Unsplash */
  unsplashUrl: string;
  /** Unsplash download tracking endpoint */
  downloadEndpoint: string;
  /** Timestamp when the photo was fetched */
  fetchedAt: number;
}

/** Subset of the Unsplash API response that we use */
export interface UnsplashApiResponse {
  id: string;
  urls: {
    raw: string;
    small: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download_location: string;
  };
}
