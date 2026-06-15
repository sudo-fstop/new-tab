let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.weather-widget {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 12px 16px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: auto;
  z-index: 1;
}

.weather-widget.visible {
  opacity: 1;
}

.weather-widget__content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.weather-widget__icon {
  font-size: 1.5rem;
  line-height: 1;
}

.weather-widget__temp {
  font-size: 1.4rem;
  font-weight: 300;
  letter-spacing: -0.02em;
}

.weather-widget__toggle {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.weather-widget__toggle:hover {
  background: rgba(255, 255, 255, 0.25);
}

.weather-widget__location {
  width: 100%;
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 2px;
}

.weather-widget__loading {
  font-size: 0.85rem;
  opacity: 0.8;
}

.weather-widget__error {
  font-size: 0.8rem;
  opacity: 0.8;
}

.weather-widget__fallback {
  margin-top: 8px;
}

.weather-widget__input {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 0.8rem;
  padding: 6px 10px;
  outline: none;
  width: 140px;
}

.weather-widget__input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.weather-widget__input:focus {
  border-color: rgba(255, 255, 255, 0.4);
}
`;
  document.head.appendChild(style);
}
