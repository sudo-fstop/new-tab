import { describe, it, expect, beforeEach, afterEach } from "vitest";

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

describe("initSearch", () => {
  let mockStorage: Storage;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage;
    mockStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, "localStorage", { value: mockStorage, writable: true, configurable: true });
    document.body.innerHTML = "";
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "localStorage", { value: originalLocalStorage, writable: true, configurable: true });
  });

  it("appends search bar to #widgets when it exists", async () => {
    const widgetsDiv = document.createElement("div");
    widgetsDiv.id = "widgets";
    document.body.appendChild(widgetsDiv);

    const { initSearch } = await import("../index");
    initSearch();

    const searchBar = widgetsDiv.querySelector(".search-bar");
    expect(searchBar).toBeTruthy();
  });

  it("appends search bar to document.body if #widgets not found", async () => {
    const { initSearch } = await import("../index");
    initSearch();

    const searchBar = document.body.querySelector(".search-bar");
    expect(searchBar).toBeTruthy();
  });

  it("injects styles into document head", async () => {
    const { initSearch } = await import("../index");
    initSearch();

    const styles = document.head.querySelectorAll("style");
    const hasSearchStyles = Array.from(styles).some(s => s.textContent?.includes(".search-bar"));
    expect(hasSearchStyles).toBe(true);
  });
});
