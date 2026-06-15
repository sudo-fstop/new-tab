import { describe, it, expect } from "vitest";
import { getGreeting, formatTime } from "../greeting";

describe("getGreeting", () => {
  it("returns 'Good morning' for hours 5-11", () => {
    expect(getGreeting(5)).toBe("Good morning");
    expect(getGreeting(8)).toBe("Good morning");
    expect(getGreeting(11)).toBe("Good morning");
  });

  it("returns 'Good afternoon' for hours 12-16", () => {
    expect(getGreeting(12)).toBe("Good afternoon");
    expect(getGreeting(14)).toBe("Good afternoon");
    expect(getGreeting(16)).toBe("Good afternoon");
  });

  it("returns 'Good evening' for hours 17-20", () => {
    expect(getGreeting(17)).toBe("Good evening");
    expect(getGreeting(19)).toBe("Good evening");
    expect(getGreeting(20)).toBe("Good evening");
  });

  it("returns 'Good night' for hours 21-4", () => {
    expect(getGreeting(21)).toBe("Good night");
    expect(getGreeting(23)).toBe("Good night");
    expect(getGreeting(0)).toBe("Good night");
    expect(getGreeting(3)).toBe("Good night");
    expect(getGreeting(4)).toBe("Good night");
  });
});

describe("formatTime", () => {
  it("returns a non-empty string", () => {
    const result = formatTime(new Date());
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("contains the minute value", () => {
    const date = new Date(2024, 0, 1, 14, 35);
    const result = formatTime(date);
    expect(result).toContain("35");
  });

  it("handles midnight", () => {
    const date = new Date(2024, 0, 1, 0, 0);
    const result = formatTime(date);
    expect(result).toBeTruthy();
  });

  it("handles noon", () => {
    const date = new Date(2024, 0, 1, 12, 0);
    const result = formatTime(date);
    expect(result).toContain("12");
  });
});
