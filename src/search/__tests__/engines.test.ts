import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ENGINES, STORAGE_KEY, getSelectedEngine, setSelectedEngine, buildSearchUrl } from "../engines";

function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe("engines", () => {
  let mockStorage: Storage;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage;
    mockStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, "localStorage", { value: mockStorage, writable: true, configurable: true });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "localStorage", { value: originalLocalStorage, writable: true, configurable: true });
  });

  it("ENGINES contains at least 4 engines", () => {
    expect(ENGINES.length).toBeGreaterThanOrEqual(4);
  });

  it("getSelectedEngine returns Google by default when localStorage is empty", () => {
    const engine = getSelectedEngine();
    expect(engine.id).toBe("google");
  });

  it("getSelectedEngine returns the correct engine when localStorage has a valid value", () => {
    mockStorage.setItem(STORAGE_KEY, "duckduckgo");
    const engine = getSelectedEngine();
    expect(engine.id).toBe("duckduckgo");
    expect(engine.name).toBe("DuckDuckGo");
  });

  it("getSelectedEngine falls back to Google for invalid localStorage values", () => {
    mockStorage.setItem(STORAGE_KEY, "nonexistent-engine");
    const engine = getSelectedEngine();
    expect(engine.id).toBe("google");
  });

  it("setSelectedEngine writes to localStorage correctly", () => {
    setSelectedEngine("bing");
    expect(mockStorage.getItem(STORAGE_KEY)).toBe("bing");
  });

  it("buildSearchUrl constructs correct URL with encoded query", () => {
    const google = ENGINES[0];
    const url = buildSearchUrl(google, "hello world");
    expect(url).toBe("https://www.google.com/search?q=hello%20world");
  });

  it("buildSearchUrl encodes special characters", () => {
    const google = ENGINES[0];
    const url = buildSearchUrl(google, "foo&bar=baz");
    expect(url).toBe("https://www.google.com/search?q=foo%26bar%3Dbaz");
  });
});
