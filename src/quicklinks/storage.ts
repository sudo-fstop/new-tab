import type { QuickLink } from "./types";

const STORAGE_KEY = "quicklinks";

export const DEFAULT_LINKS: QuickLink[] = [
  { id: "default-1", title: "Google", url: "https://www.google.com" },
  { id: "default-2", title: "YouTube", url: "https://www.youtube.com" },
  { id: "default-3", title: "GitHub", url: "https://github.com" },
  { id: "default-4", title: "Reddit", url: "https://www.reddit.com" },
  { id: "default-5", title: "Gmail", url: "https://mail.google.com" },
  { id: "default-6", title: "Wikipedia", url: "https://www.wikipedia.org" },
];

export function getLinks(): QuickLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [...DEFAULT_LINKS];
    return JSON.parse(raw) as QuickLink[];
  } catch {
    return [...DEFAULT_LINKS];
  }
}

export function saveLinks(links: QuickLink[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch {
    // Quota exceeded or unavailable — silently ignore
  }
}

export function addLink(link: QuickLink): QuickLink[] {
  const links = getLinks();
  links.push(link);
  saveLinks(links);
  return links;
}

export function removeLink(id: string): QuickLink[] {
  const links = getLinks().filter((l) => l.id !== id);
  saveLinks(links);
  return links;
}

export function updateLink(
  id: string,
  updates: Partial<Omit<QuickLink, "id">>,
): QuickLink[] {
  const links = getLinks().map((l) =>
    l.id === id ? { ...l, ...updates } : l,
  );
  saveLinks(links);
  return links;
}
