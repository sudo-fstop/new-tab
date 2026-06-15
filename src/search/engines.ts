export interface SearchEngine {
  id: string;
  name: string;
  urlTemplate: string;
  icon: string;
}

export const ENGINES: SearchEngine[] = [
  { id: "google", name: "Google", urlTemplate: "https://www.google.com/search?q={query}", icon: "G" },
  { id: "duckduckgo", name: "DuckDuckGo", urlTemplate: "https://duckduckgo.com/?q={query}", icon: "D" },
  { id: "bing", name: "Bing", urlTemplate: "https://www.bing.com/search?q={query}", icon: "B" },
  { id: "brave", name: "Brave Search", urlTemplate: "https://search.brave.com/search?q={query}", icon: "Br" },
];

export const STORAGE_KEY = "search-engine";

export function getSelectedEngine(): SearchEngine {
  const stored = localStorage.getItem(STORAGE_KEY);
  return ENGINES.find(e => e.id === stored) ?? ENGINES[0];
}

export function setSelectedEngine(id: string): void {
  localStorage.setItem(STORAGE_KEY, id);
}

export function buildSearchUrl(engine: SearchEngine, query: string): string {
  return engine.urlTemplate.replace("{query}", encodeURIComponent(query));
}
