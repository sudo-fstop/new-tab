import { getLinks, addLink, removeLink, updateLink } from "./storage";
import { showAddModal, showEditModal } from "./modal";
import type { QuickLink } from "./types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `ql-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createFallbackIcon(title: string): HTMLElement {
  const div = document.createElement("div");
  div.className = "quicklinks-item__fallback";
  div.textContent = title.charAt(0).toUpperCase();
  return div;
}

function createLinkItem(link: QuickLink): HTMLElement {
  const anchor = document.createElement("a");
  anchor.className = "quicklinks-item";
  anchor.href = link.url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";

  // Favicon image
  const domain = getDomain(link.url);
  const img = document.createElement("img");
  img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  img.alt = escapeHtml(link.title);
  img.loading = "lazy";
  img.addEventListener("error", () => {
    const fallback = createFallbackIcon(link.title);
    img.replaceWith(fallback);
  });
  anchor.appendChild(img);

  // Title
  const titleSpan = document.createElement("span");
  titleSpan.textContent = link.title;
  anchor.appendChild(titleSpan);

  // Hover toolbar
  const toolbar = document.createElement("div");
  toolbar.className = "quicklinks-item__toolbar";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✎";
  editBtn.title = "Edit";
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showEditModal(link, (url, title) => {
      updateLink(link.id, { url, title });
      renderQuickLinks();
    });
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeLink(link.id);
    renderQuickLinks();
  });

  toolbar.appendChild(editBtn);
  toolbar.appendChild(deleteBtn);
  anchor.appendChild(toolbar);

  return anchor;
}

export function renderQuickLinks(): void {
  const container =
    document.querySelector<HTMLElement>(".quicklinks-container") ||
    createContainer();

  container.innerHTML = "";

  const links = getLinks();

  for (const link of links) {
    container.appendChild(createLinkItem(link));
  }

  // Add button
  const addBtn = document.createElement("button");
  addBtn.className = "quicklinks-add-btn";
  addBtn.textContent = "+";
  addBtn.title = "Add quick link";
  addBtn.addEventListener("click", () => {
    showAddModal((url, title) => {
      addLink({ id: generateId(), title, url });
      renderQuickLinks();
    });
  });
  container.appendChild(addBtn);
}

function createContainer(): HTMLElement {
  const container = document.createElement("div");
  container.className = "quicklinks-container";

  const widgets = document.getElementById("widgets");
  if (widgets) {
    widgets.appendChild(container);
  } else {
    document.body.appendChild(container);
  }

  return container;
}
