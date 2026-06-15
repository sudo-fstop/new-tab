let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.greeting-widget {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.greeting-widget.visible {
  opacity: 1;
}

.greeting-widget__time {
  font-size: 5rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.greeting-widget__greeting {
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 8px;
  opacity: 0.9;
}

@media (max-width: 600px) {
  .greeting-widget__time {
    font-size: 3rem;
  }

  .greeting-widget__greeting {
    font-size: 1.1rem;
  }
}
`;
  document.head.appendChild(style);
}
