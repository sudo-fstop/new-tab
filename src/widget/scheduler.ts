import { people } from "./data";
import { pickRandom } from "./history";
import { renderPerson, fadeOut, fadeIn } from "./render";

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
let lastChangeTime: number = Date.now();
let intervalId: ReturnType<typeof setInterval> | undefined;

export function showRandomPerson(): void {
  const index = pickRandom(people.length);
  renderPerson(people[index]);
}

export async function refreshPerson(): Promise<void> {
  await fadeOut();
  showRandomPerson();
  fadeIn();
  lastChangeTime = Date.now();
}

export function startScheduler(): void {
  showRandomPerson();
  lastChangeTime = Date.now();

  intervalId = setInterval(refreshPerson, REFRESH_INTERVAL);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const elapsed = Date.now() - lastChangeTime;
      if (elapsed >= REFRESH_INTERVAL) {
        refreshPerson();
        clearInterval(intervalId);
        intervalId = setInterval(refreshPerson, REFRESH_INTERVAL);
      }
    }
  });
}
