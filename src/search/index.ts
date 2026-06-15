import { injectStyles } from "./style";
import { createSearchBar, autoFocus } from "./render";

export function initSearch(): void {
  injectStyles();

  const container = document.getElementById("widgets");
  const searchBar = createSearchBar();

  if (container) {
    container.appendChild(searchBar);
  } else {
    document.body.appendChild(searchBar);
  }

  queueMicrotask(() => {
    autoFocus();
  });
}
