let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.todo-widget {
  position: absolute;
  bottom: 40px;
  left: 24px;
  width: min(320px, 85vw);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.todo-widget.visible {
  opacity: 1;
}

.todo-widget__title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
  opacity: 0.8;
}

.todo-widget__input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.todo-widget__input {
  flex: 1;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 0.85rem;
  outline: none;
}

.todo-widget__input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.todo-widget__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.todo-widget__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.85rem;
}

.todo-widget__item:last-child {
  border-bottom: none;
}

.todo-widget__checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  background: transparent;
  margin: 0;
  padding: 0;
}

.todo-widget__checkbox:checked {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.7);
}

.todo-widget__text {
  flex: 1;
  word-break: break-word;
}

.todo-widget__text--completed {
  text-decoration: line-through;
  opacity: 0.5;
}

.todo-widget__delete {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.15s;
  padding: 2px 4px;
}

.todo-widget__item:hover .todo-widget__delete {
  opacity: 1;
}

.todo-widget__empty {
  text-align: center;
  padding: 16px 0;
  opacity: 0.5;
  font-size: 0.8rem;
}

@supports not (backdrop-filter: blur(1px)) {
  .todo-widget {
    background: rgba(0, 0, 0, 0.7);
  }
}
`;
  document.head.appendChild(style);
}
