import { describe, it, expect, beforeEach } from "vitest";
import { showAddModal, showEditModal, closeModal } from "../modal";
import type { QuickLink } from "../types";

describe("quicklinks/modal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    closeModal();
  });

  it("showAddModal creates modal with empty fields", () => {
    showAddModal(() => {});
    const modal = document.querySelector(".quicklinks-modal");
    expect(modal).not.toBeNull();
    const inputs = modal!.querySelectorAll("input");
    expect(inputs.length).toBe(2);
    expect(inputs[0].value).toBe("");
    expect(inputs[1].value).toBe("");
  });

  it("showEditModal creates modal with pre-filled fields", () => {
    const link: QuickLink = {
      id: "edit-1",
      title: "GitHub",
      url: "https://github.com",
    };
    showEditModal(link, () => {});
    const modal = document.querySelector(".quicklinks-modal");
    expect(modal).not.toBeNull();
    const inputs = modal!.querySelectorAll("input");
    expect(inputs[0].value).toBe("https://github.com");
    expect(inputs[1].value).toBe("GitHub");
  });

  it("save button calls callback with correct values", () => {
    let savedUrl = "";
    let savedTitle = "";
    showAddModal((url, title) => {
      savedUrl = url;
      savedTitle = title;
    });

    const modal = document.querySelector(".quicklinks-modal")!;
    const inputs = modal.querySelectorAll("input");
    // Set URL
    inputs[0].value = "https://example.com";
    // Set title
    inputs[1].value = "Example";

    const saveBtn = modal.querySelector(
      ".quicklinks-modal__btn-save",
    ) as HTMLButtonElement;
    saveBtn.click();

    expect(savedUrl).toBe("https://example.com");
    expect(savedTitle).toBe("Example");
  });

  it("cancel button closes modal", () => {
    showAddModal(() => {});
    expect(document.querySelector(".quicklinks-modal")).not.toBeNull();

    const cancelBtn = document.querySelector(
      ".quicklinks-modal__btn-cancel",
    ) as HTMLButtonElement;
    cancelBtn.click();

    expect(document.querySelector(".quicklinks-modal")).toBeNull();
  });

  it("overlay click closes modal", () => {
    showAddModal(() => {});
    expect(document.querySelector(".quicklinks-modal")).not.toBeNull();

    const overlay = document.querySelector(
      ".quicklinks-modal-overlay",
    ) as HTMLElement;
    overlay.click();

    expect(document.querySelector(".quicklinks-modal")).toBeNull();
  });

  it("URL validation rejects empty URL", () => {
    showAddModal(() => {});
    const modal = document.querySelector(".quicklinks-modal")!;
    const saveBtn = modal.querySelector(
      ".quicklinks-modal__btn-save",
    ) as HTMLButtonElement;
    saveBtn.click();

    // Modal should still be open with error
    expect(document.querySelector(".quicklinks-modal")).not.toBeNull();
    const error = modal.querySelector(".quicklinks-modal__error") as HTMLElement;
    expect(error.style.display).toBe("block");
  });

  it("URL validation prepends https:// if missing", () => {
    let savedUrl = "";
    showAddModal((url) => {
      savedUrl = url;
    });

    const modal = document.querySelector(".quicklinks-modal")!;
    const inputs = modal.querySelectorAll("input");
    inputs[0].value = "example.com";

    const saveBtn = modal.querySelector(
      ".quicklinks-modal__btn-save",
    ) as HTMLButtonElement;
    saveBtn.click();

    expect(savedUrl).toBe("https://example.com");
  });

  it("closeModal removes modal from DOM", () => {
    showAddModal(() => {});
    expect(document.querySelector(".quicklinks-modal")).not.toBeNull();
    expect(document.querySelector(".quicklinks-modal-overlay")).not.toBeNull();

    closeModal();

    expect(document.querySelector(".quicklinks-modal")).toBeNull();
    expect(document.querySelector(".quicklinks-modal-overlay")).toBeNull();
  });
});
