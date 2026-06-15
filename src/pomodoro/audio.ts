let audioCtx: AudioContext | null = null;

export function playBeep(): void {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    const now = audioCtx.currentTime;

    // First beep: 800Hz for 150ms
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 800;
    gain1.gain.value = 0.3;
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second beep: 600Hz for 150ms after a 100ms gap
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 600;
    gain2.gain.value = 0.3;
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.4);
  } catch {
    // Silently fail if Web Audio is unavailable
  }
}
