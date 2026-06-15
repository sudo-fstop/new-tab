import { ENGINES, getSelectedEngine, setSelectedEngine, buildSearchUrl, type SearchEngine } from "./engines";

let currentEngine: SearchEngine;
let containerEl: HTMLElement | null = null;

export function createSearchBar(): HTMLElement {
  currentEngine = getSelectedEngine();

  const container = document.createElement("div");
  container.className = "search-bar";

  // Engine toggle button
  const engineBtn = document.createElement("button");
  engineBtn.className = "search-bar__engine-btn";
  engineBtn.type = "button";
  engineBtn.textContent = currentEngine.icon;
  engineBtn.setAttribute("aria-label", `Search engine: ${currentEngine.name}`);

  // Input
  const input = document.createElement("input");
  input.className = "search-bar__input";
  input.type = "text";
  input.placeholder = "Search the web...";
  input.setAttribute("aria-label", "Search the web");

  // Dropdown
  const dropdown = document.createElement("div");
  dropdown.className = "search-bar__dropdown";
  dropdown.setAttribute("role", "listbox");

  for (const engine of ENGINES) {
    const item = document.createElement("div");
    item.className = "search-bar__dropdown-item";
    if (engine.id === currentEngine.id) item.classList.add("active");
    item.textContent = engine.name;
    item.setAttribute("role", "option");
    item.dataset.engineId = engine.id;
    item.addEventListener("click", () => {
      selectEngine(engine, engineBtn, dropdown);
      input.focus();
    });
    dropdown.appendChild(item);
  }

  // Event: toggle dropdown
  engineBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });

  // Event: submit search on Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = input.value.trim();
      if (!query) return;
      window.location.href = buildSearchUrl(currentEngine, query);
    }
  });

  // Event: close dropdown on outside click
  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
  });

  container.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  container.appendChild(engineBtn);
  container.appendChild(input);
  container.appendChild(dropdown);

  containerEl = container;
  return container;
}

function selectEngine(engine: SearchEngine, btn: HTMLElement, dropdown: HTMLElement): void {
  currentEngine = engine;
  setSelectedEngine(engine.id);
  btn.textContent = engine.icon;
  btn.setAttribute("aria-label", `Search engine: ${engine.name}`);

  const items = dropdown.querySelectorAll(".search-bar__dropdown-item");
  items.forEach((item) => {
    if (item instanceof HTMLElement) {
      item.classList.toggle("active", item.dataset.engineId === engine.id);
    }
  });

  dropdown.classList.remove("open");
}

export function autoFocus(): void {
  if (document.activeElement === document.body || document.activeElement === null) {
    const input = containerEl?.querySelector<HTMLInputElement>(".search-bar__input");
    input?.focus();
  }
}
