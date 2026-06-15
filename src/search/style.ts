let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.search-bar {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  width: min(560px, 90vw);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 28px;
  padding: 8px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: background 0.2s ease;
}

.search-bar:focus-within {
  background: rgba(0, 0, 0, 0.5);
}

.search-bar__input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1rem;
  padding: 8px 12px;
  caret-color: #fff;
}

.search-bar__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-bar__engine-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}

.search-bar__engine-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.search-bar__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 16px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 160px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  display: none;
  z-index: 10;
}

.search-bar__dropdown.open {
  display: block;
}

.search-bar__dropdown-item {
  padding: 8px 16px;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
}

.search-bar__dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-bar__dropdown-item.active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 600;
}
`;
  document.head.appendChild(style);
}
