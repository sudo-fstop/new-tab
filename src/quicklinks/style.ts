let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
.quicklinks-container {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  max-width: 900px;
  z-index: 1;
}

.quicklinks-item {
  width: 72px;
  text-align: center;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  display: block;
}

.quicklinks-item img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  object-fit: contain;
}

.quicklinks-item__fallback {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 auto;
}

.quicklinks-item span {
  display: block;
  font-size: 11px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 72px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.quicklinks-item__toolbar {
  position: absolute;
  top: -8px;
  right: -4px;
  display: none;
  gap: 2px;
}

.quicklinks-item:hover .quicklinks-item__toolbar {
  display: flex;
}

.quicklinks-item__toolbar button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  backdrop-filter: blur(4px);
}

.quicklinks-item__toolbar button:hover {
  background: rgba(0, 0, 0, 0.85);
}

.quicklinks-add-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, color 0.2s;
  align-self: flex-start;
  margin-top: 0;
}

.quicklinks-add-btn:hover {
  border-color: rgba(255, 255, 255, 0.7);
  color: rgba(255, 255, 255, 0.9);
}

.quicklinks-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.quicklinks-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 24px;
  color: #fff;
  z-index: 100;
  min-width: 320px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.quicklinks-modal h3 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.quicklinks-modal label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
  opacity: 0.8;
}

.quicklinks-modal input {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.quicklinks-modal input:focus {
  border-color: rgba(255, 255, 255, 0.5);
}

.quicklinks-modal__error {
  color: #ff6b6b;
  font-size: 0.8rem;
  margin: -8px 0 8px 0;
}

.quicklinks-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.quicklinks-modal__actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.quicklinks-modal__btn-cancel {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.quicklinks-modal__btn-cancel:hover {
  background: rgba(255, 255, 255, 0.25);
}

.quicklinks-modal__btn-save {
  background: #4a9eff;
  color: #fff;
}

.quicklinks-modal__btn-save:hover {
  background: #3a8eef;
}

@media (max-width: 600px) {
  .quicklinks-container {
    gap: 10px;
    padding: 12px;
    bottom: 60px;
  }

  .quicklinks-item {
    width: 60px;
  }

  .quicklinks-item img,
  .quicklinks-item__fallback {
    width: 40px;
    height: 40px;
  }

  .quicklinks-item span {
    font-size: 10px;
    max-width: 60px;
  }

  .quicklinks-modal {
    min-width: unset;
    left: 16px;
    right: 16px;
    width: auto;
    transform: translateY(-50%);
  }
}
`;
  document.head.appendChild(style);
}
