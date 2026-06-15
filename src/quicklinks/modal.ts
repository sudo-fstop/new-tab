import type { QuickLink } from "./types";

let currentOverlay: HTMLElement | null = null;
let currentModal: HTMLElement | null = null;
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function deriveTitleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. prefix and return capitalized domain name
    const domain = hostname.replace(/^www\./, "");
    const name = domain.split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url;
  }
}

export function closeModal(): void {
  if (currentOverlay) {
    currentOverlay.remove();
    currentOverlay = null;
  }
  if (currentModal) {
    currentModal.remove();
    currentModal = null;
  }
  if (escapeHandler) {
    document.removeEventListener("keydown", escapeHandler);
    escapeHandler = null;
  }
}

function createModal(
  title: string,
  initialUrl: string,
  initialTitle: string,
  onSave: (url: string, title: string) => void,
): void {
  closeModal();

  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "quicklinks-modal-overlay";
  overlay.addEventListener("click", closeModal);
  document.body.appendChild(overlay);
  currentOverlay = overlay;

  // Modal
  const modal = document.createElement("div");
  modal.className = "quicklinks-modal";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const urlLabel = document.createElement("label");
  urlLabel.textContent = "URL";
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://example.com";
  urlInput.value = initialUrl;

  const errorEl = document.createElement("div");
  errorEl.className = "quicklinks-modal__error";
  errorEl.style.display = "none";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title (optional)";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "My Favorite Site";
  titleInput.value = initialTitle;

  const actions = document.createElement("div");
  actions.className = "quicklinks-modal__actions";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "quicklinks-modal__btn-cancel";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", closeModal);

  const saveBtn = document.createElement("button");
  saveBtn.className = "quicklinks-modal__btn-save";
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    const url = normalizeUrl(urlInput.value);
    if (!isValidUrl(url)) {
      errorEl.textContent = "Please enter a valid URL";
      errorEl.style.display = "block";
      return;
    }
    const linkTitle = titleInput.value.trim() || deriveTitleFromUrl(url);
    closeModal();
    onSave(url, linkTitle);
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(saveBtn);

  modal.appendChild(heading);
  modal.appendChild(urlLabel);
  modal.appendChild(urlInput);
  modal.appendChild(errorEl);
  modal.appendChild(titleLabel);
  modal.appendChild(titleInput);
  modal.appendChild(actions);

  document.body.appendChild(modal);
  currentModal = modal;

  // Focus URL input
  urlInput.focus();

  // Escape key handler
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", escapeHandler);
}

export function showAddModal(
  onSave: (url: string, title: string) => void,
): void {
  createModal("Add Quick Link", "", "", onSave);
}

export function showEditModal(
  link: QuickLink,
  onSave: (url: string, title: string) => void,
): void {
  createModal("Edit Quick Link", link.url, link.title, onSave);
}
