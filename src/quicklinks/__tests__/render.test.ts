import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderQuickLinks, getDomain } from "../render";

function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe("quicklinks/render", () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    vi.stubGlobal("localStorage", mockStorage);
    document.body.innerHTML = '<div id="widgets"></div>';
  });

  it("creates container in #widgets", () => {
    renderQuickLinks();
    const container = document.querySelector(".quicklinks-container");
    expect(container).not.toBeNull();
    expect(container?.parentElement?.id).toBe("widgets");
  });

  it("renders default links + add button", () => {
    renderQuickLinks();
    const items = document.querySelectorAll(".quicklinks-item");
    expect(items.length).toBe(6); // 6 default links
    const addBtn = document.querySelector(".quicklinks-add-btn");
    expect(addBtn).not.toBeNull();
  });

  it("renders correct href and favicon for each link", () => {
    mockStorage.setItem(
      "quicklinks",
      JSON.stringify([
        { id: "1", title: "Test Site", url: "https://example.com" },
      ]),
    );
    renderQuickLinks();
    const anchor = document.querySelector<HTMLAnchorElement>(".quicklinks-item");
    expect(anchor?.href).toBe("https://example.com/");
    const img = anchor?.querySelector("img");
    expect(img?.src).toContain("example.com");
  });

  it("renders title text in span", () => {
    mockStorage.setItem(
      "quicklinks",
      JSON.stringify([
        { id: "1", title: "My Site", url: "https://mysite.com" },
      ]),
    );
    renderQuickLinks();
    const span = document.querySelector(".quicklinks-item span");
    expect(span?.textContent).toBe("My Site");
  });

  it("clicking delete removes link and re-renders", () => {
    mockStorage.setItem(
      "quicklinks",
      JSON.stringify([
        { id: "del-1", title: "Delete Me", url: "https://delete.com" },
        { id: "keep-1", title: "Keep Me", url: "https://keep.com" },
      ]),
    );
    renderQuickLinks();
    expect(document.querySelectorAll(".quicklinks-item").length).toBe(2);

    const deleteBtn = document.querySelector(
      ".quicklinks-item__toolbar button:last-child",
    ) as HTMLButtonElement;
    deleteBtn.click();

    expect(document.querySelectorAll(".quicklinks-item").length).toBe(1);
  });

  it("getDomain extracts domain correctly", () => {
    expect(getDomain("https://www.example.com/path")).toBe("www.example.com");
    expect(getDomain("https://github.com")).toBe("github.com");
    expect(getDomain("http://sub.domain.org:8080/page")).toBe(
      "sub.domain.org",
    );
    expect(getDomain("not-a-url")).toBe("not-a-url");
  });

  it("clicking add button opens modal", () => {
    mockStorage.setItem("quicklinks", JSON.stringify([]));
    renderQuickLinks();

    const addBtn = document.querySelector(
      ".quicklinks-add-btn",
    ) as HTMLButtonElement;
    addBtn.click();

    const modal = document.querySelector(".quicklinks-modal");
    expect(modal).not.toBeNull();
  });
});
