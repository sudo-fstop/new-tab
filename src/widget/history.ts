const STORAGE_KEY = "widget-inspiring-person-history";

function readHistory(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === "number")) {
      return parsed as number[];
    }
    return [];
  } catch {
    return [];
  }
}

function writeHistory(history: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function getHistory(): number[] {
  return readHistory();
}

export function addToHistory(index: number, totalCount: number): void {
  const history = readHistory();
  history.push(index);
  if (history.length >= totalCount) {
    writeHistory([]);
  } else {
    writeHistory(history);
  }
}

export function pickRandom(totalCount: number): number {
  let history = readHistory();

  if (history.length >= totalCount) {
    writeHistory([]);
    history = [];
  }

  const shown = new Set(history);
  const available: number[] = [];
  for (let i = 0; i < totalCount; i++) {
    if (!shown.has(i)) {
      available.push(i);
    }
  }

  const index = available[Math.floor(Math.random() * available.length)];
  addToHistory(index, totalCount);
  return index;
}
