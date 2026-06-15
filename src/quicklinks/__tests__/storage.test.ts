import { describe, it, expect, beforeEach, vi } from "vitest";
import type { QuickLink } from "../types";
import {
  getLinks,
  saveLinks,
  addLink,
  removeLink,
  updateLink,
  DEFAULT_LINKS,
} from "../storage";

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

describe("quicklinks/storage", () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    vi.stubGlobal("localStorage", mockStorage);
  });

  it("getLinks returns defaults when localStorage is empty", () => {
    const links = getLinks();
    expect(links).toEqual(DEFAULT_LINKS);
    expect(links.length).toBe(6);
  });

  it("getLinks returns parsed data from localStorage", () => {
    const testLinks: QuickLink[] = [
      { id: "1", title: "Test", url: "https://test.com" },
    ];
    mockStorage.setItem("quicklinks", JSON.stringify(testLinks));
    expect(getLinks()).toEqual(testLinks);
  });

  it("getLinks handles corrupted data gracefully", () => {
    mockStorage.setItem("quicklinks", "not valid json{{{");
    expect(getLinks()).toEqual(DEFAULT_LINKS);
  });

  it("saveLinks writes to localStorage", () => {
    const links: QuickLink[] = [
      { id: "1", title: "Test", url: "https://test.com" },
    ];
    saveLinks(links);
    expect(JSON.parse(mockStorage.getItem("quicklinks")!)).toEqual(links);
  });

  it("saveLinks handles quota errors gracefully", () => {
    mockStorage.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
    expect(() =>
      saveLinks([{ id: "1", title: "Test", url: "https://test.com" }]),
    ).not.toThrow();
  });

  it("addLink appends and persists", () => {
    mockStorage.setItem("quicklinks", JSON.stringify([]));
    const newLink: QuickLink = {
      id: "new-1",
      title: "New",
      url: "https://new.com",
    };
    const result = addLink(newLink);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newLink);
    expect(JSON.parse(mockStorage.getItem("quicklinks")!)).toEqual([newLink]);
  });

  it("removeLink filters out and persists", () => {
    const existing: QuickLink[] = [
      { id: "a", title: "A", url: "https://a.com" },
      { id: "b", title: "B", url: "https://b.com" },
    ];
    mockStorage.setItem("quicklinks", JSON.stringify(existing));
    const result = removeLink("a");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });

  it("updateLink modifies the correct link and persists", () => {
    const existing: QuickLink[] = [
      { id: "a", title: "A", url: "https://a.com" },
      { id: "b", title: "B", url: "https://b.com" },
    ];
    mockStorage.setItem("quicklinks", JSON.stringify(existing));
    const result = updateLink("a", { title: "Updated A" });
    expect(result[0]).toEqual({
      id: "a",
      title: "Updated A",
      url: "https://a.com",
    });
    expect(result[1]).toEqual(existing[1]);
  });
});
