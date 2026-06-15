let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.shortcuts-overlay {
  position: fixed;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #fff;
}

.shortcuts-overlay__card {
  background: rgba(30, 30, 50, 0.85);
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.shortcuts-overlay__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.shortcuts-overlay__close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.shortcuts-overlay__close:hover {
  opacity: 1;
}

.shortcuts-overlay__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.shortcuts-overlay__row:last-child {
  border-bottom: none;
}

.shortcuts-overlay__key kbd {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 4px 10px;
  font-family: monospace;
  font-size: 0.85rem;
  min-width: 32px;
  text-align: center;
}

.shortcuts-overlay__desc {
  font-size: 0.9rem;
  opacity: 0.85;
}

.shortcuts-hidden {
  display: none !important;
}
`;
  document.head.appendChild(style);
}
