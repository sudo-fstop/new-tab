let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.pomodoro-widget {
  position: absolute;
  top: 16px;
  left: 16px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 180px;
  opacity: 0;
  transition: opacity 0.5s ease;
  user-select: none;
}

.pomodoro-widget.visible {
  opacity: 1;
}

.pomodoro-widget__time {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.pomodoro-widget__mode {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: 4px;
  opacity: 0.8;
}

.pomodoro-widget[data-mode="work"] .pomodoro-widget__mode {
  color: #ff6b6b;
}

.pomodoro-widget[data-mode="break"] .pomodoro-widget__mode {
  color: #51cf66;
}

.pomodoro-widget__controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.pomodoro-widget__btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  text-shadow: none;
}

.pomodoro-widget__btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.pomodoro-widget__sessions {
  font-size: 0.7rem;
  text-align: center;
  margin-top: 8px;
  opacity: 0.7;
}

.pomodoro-widget.flash {
  animation: pomodoro-flash 0.5s ease 3;
}

@keyframes pomodoro-flash {
  0%, 100% { background: rgba(0, 0, 0, 0.25); }
  50% { background: rgba(255, 255, 255, 0.3); }
}

@media (max-width: 600px) {
  .pomodoro-widget__time {
    font-size: 1.8rem;
  }
  .pomodoro-widget {
    padding: 12px 14px;
    min-width: 140px;
  }
}
`;
  document.head.appendChild(style);
}
