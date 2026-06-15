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

describe("render", () => {
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

  async function importRender() {
    return await import("../render");
  }

  it("createSearchBar returns an element with correct class", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    expect(el.className).toBe("search-bar");
  });

  it("createSearchBar contains an input, button, and dropdown", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    expect(el.querySelector(".search-bar__input")).toBeTruthy();
    expect(el.querySelector(".search-bar__engine-btn")).toBeTruthy();
    expect(el.querySelector(".search-bar__dropdown")).toBeTruthy();
  });

  it("input has correct placeholder text", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    const input = el.querySelector<HTMLInputElement>(".search-bar__input");
    expect(input?.placeholder).toBe("Search the web...");
  });

  it("dropdown contains all engines", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    const items = el.querySelectorAll(".search-bar__dropdown-item");
    expect(items.length).toBe(4);
  });

  it("engine button shows default engine icon", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    const btn = el.querySelector<HTMLButtonElement>(".search-bar__engine-btn");
    expect(btn?.textContent).toBe("G");
  });

  it("Enter key with non-empty query sets window.location.href", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    document.body.appendChild(el);

    const input = el.querySelector<HTMLInputElement>(".search-bar__input")!;
    input.value = "test query";

    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    input.dispatchEvent(event);
  });

  it("Enter key with empty query does not navigate", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    document.body.appendChild(el);

    const input = el.querySelector<HTMLInputElement>(".search-bar__input")!;
    input.value = "   ";

    const originalHref = window.location.href;
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    input.dispatchEvent(event);

    expect(window.location.href).toBe(originalHref);
  });

  it("engine button click toggles dropdown visibility", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    document.body.appendChild(el);

    const btn = el.querySelector<HTMLButtonElement>(".search-bar__engine-btn")!;
    const dropdown = el.querySelector<HTMLElement>(".search-bar__dropdown")!;

    expect(dropdown.classList.contains("open")).toBe(false);
    btn.click();
    expect(dropdown.classList.contains("open")).toBe(true);
    btn.click();
    expect(dropdown.classList.contains("open")).toBe(false);
  });

  it("selecting an engine updates the button text and persists to localStorage", async () => {
    const { createSearchBar } = await importRender();
    const el = createSearchBar();
    document.body.appendChild(el);

    const btn = el.querySelector<HTMLButtonElement>(".search-bar__engine-btn")!;
    const items = el.querySelectorAll<HTMLElement>(".search-bar__dropdown-item");

    items[1].click();

    expect(btn.textContent).toBe("D");
    expect(mockStorage.getItem("search-engine")).toBe("duckduckgo");
  });

  it("autoFocus focuses the input when body is active element", async () => {
    const { createSearchBar, autoFocus } = await importRender();
    const el = createSearchBar();
    document.body.appendChild(el);

    autoFocus();

    const input = el.querySelector<HTMLInputElement>(".search-bar__input");
    expect(document.activeElement).toBe(input);
  });
});
