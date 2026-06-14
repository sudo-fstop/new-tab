import { injectStyles } from "./style";
import { startScheduler } from "./scheduler";

export function initWidget(): void {
  injectStyles();
  startScheduler();
}
