let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.inspiring-person-widget {
  position: absolute;
  bottom: 32px;
  left: 32px;
  max-width: 420px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: opacity 0.5s ease;
  opacity: 1;
}

.inspiring-person-widget.fade-out {
  opacity: 0;
}

.inspiring-person-widget__name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.inspiring-person-widget__quote {
  font-size: 0.95rem;
  font-style: italic;
  margin-bottom: 12px;
  line-height: 1.4;
  opacity: 0.95;
}

.inspiring-person-widget__blurb {
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 12px;
  opacity: 0.85;
}

.inspiring-person-widget__links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.inspiring-person-widget__links a {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-size: 0.8rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.inspiring-person-widget__links a:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .inspiring-person-widget {
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: none;
    padding: 16px;
  }

  .inspiring-person-widget__name {
    font-size: 1.1rem;
  }

  .inspiring-person-widget__quote {
    font-size: 0.85rem;
  }
}
`;
  document.head.appendChild(style);
}
