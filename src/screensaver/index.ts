const INACTIVITY_TIMEOUT = 30_000;
const SPEED = 3;
const EMOJI_SIZE = 90;

const USER_EVENTS = [
  "mousemove",
  "keydown",
  "click",
  "scroll",
  "touchstart",
] as const;

let screensaverEl: HTMLElement;
let bouncerEl: HTMLElement;
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let rafId: number | null = null;
let isActive = false;

// Bounce state
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let hue = 0;
let lastTime = 0;

export function initScreensaver(): void {
  const el = document.getElementById("screensaver");
  if (!el) {
    console.warn("[screensaver] #screensaver element not found");
    return;
  }
  screensaverEl = el;

  bouncerEl = document.createElement("div");
  bouncerEl.className = "bouncer";
  bouncerEl.textContent = "🐶";
  screensaverEl.appendChild(bouncerEl);

  startInactivityWatch();
  console.log("[screensaver] initialized");
}

function handleUserActivity(): void {
  if (isActive) {
    deactivate();
  } else {
    if (inactivityTimer !== null) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(activate, INACTIVITY_TIMEOUT);
  }
}

function startInactivityWatch(): void {
  for (const event of USER_EVENTS) {
    document.addEventListener(event, handleUserActivity, { passive: true });
  }
  inactivityTimer = setTimeout(activate, INACTIVITY_TIMEOUT);
}

function stopInactivityWatch(): void {
  for (const event of USER_EVENTS) {
    document.removeEventListener(event, handleUserActivity);
  }
  if (inactivityTimer !== null) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
}

function activate(): void {
  isActive = true;
  stopInactivityWatch();

  // Randomize initial position
  x = Math.random() * (window.innerWidth - EMOJI_SIZE);
  y = Math.random() * (window.innerHeight - EMOJI_SIZE);

  // Randomize direction — pick angle avoiding near-axis values
  const quadrant = Math.floor(Math.random() * 4);
  const baseAngle = Math.PI / 6 + Math.random() * (Math.PI / 6); // π/6 to π/3
  const angle = baseAngle + (quadrant * Math.PI) / 2;
  dx = SPEED * Math.cos(angle);
  dy = SPEED * Math.sin(angle);

  hue = 0;

  // Apply initial position
  bouncerEl.style.transform = `translate(${x}px, ${y}px)`;
  bouncerEl.style.filter = `hue-rotate(${hue}deg)`;

  // Show overlay with fade-in
  screensaverEl.classList.add("active");
  requestAnimationFrame(() => {
    screensaverEl.classList.add("visible");
  });

  // Re-attach listeners so any interaction dismisses screensaver
  for (const event of USER_EVENTS) {
    document.addEventListener(event, handleUserActivity, { passive: true });
  }

  // Start animation
  lastTime = performance.now();
  rafId = requestAnimationFrame(tick);
}

function deactivate(): void {
  isActive = false;

  // Stop animation
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Remove interaction listeners
  for (const event of USER_EVENTS) {
    document.removeEventListener(event, handleUserActivity);
  }

  // Fade out
  screensaverEl.classList.remove("visible");

  const onTransitionEnd = (): void => {
    screensaverEl.removeEventListener("transitionend", onTransitionEnd);
    screensaverEl.classList.remove("active");
  };
  screensaverEl.addEventListener("transitionend", onTransitionEnd);

  // Fallback in case transitionend doesn't fire
  setTimeout(() => {
    screensaverEl.classList.remove("active");
  }, 600);

  // Restart inactivity watching
  startInactivityWatch();
}

function tick(now: number): void {
  const delta = (now - lastTime) / 16.667;
  lastTime = now;

  x += dx * delta;
  y += dy * delta;

  const maxX = window.innerWidth - EMOJI_SIZE;
  const maxY = window.innerHeight - EMOJI_SIZE;
  let bounced = false;

  if (x <= 0) {
    x = 0;
    dx = Math.abs(dx);
    bounced = true;
  } else if (x >= maxX) {
    x = maxX;
    dx = -Math.abs(dx);
    bounced = true;
  }

  if (y <= 0) {
    y = 0;
    dy = Math.abs(dy);
    bounced = true;
  } else if (y >= maxY) {
    y = maxY;
    dy = -Math.abs(dy);
    bounced = true;
  }

  if (bounced) {
    hue = (hue + 47) % 360;
    bouncerEl.style.filter = `hue-rotate(${hue}deg)`;
  }

  bouncerEl.style.transform = `translate(${x}px, ${y}px)`;

  rafId = requestAnimationFrame(tick);
}
