import { NOTE_ORDER, normalizeNote } from "./music";

const FREQ_BASE: Record<string, number> = {
  C: 261.63, "C#": 277.18, D: 293.66, "D#": 311.13,
  E: 329.63, F: 349.23, "F#": 369.99, G: 392.0,
  "G#": 415.3, A: 440.0, "A#": 466.16, B: 493.88,
};

export function playChord(notes: string[]): void {
  if (typeof window === "undefined") return;

  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    notes.forEach((note, i) => {
      const normalized = normalizeNote(note);
      if (!normalized) return;
      const freq = FREQ_BASE[normalized];
      if (!freq) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "triangle";
      const start = ctx.currentTime + i * 0.07;

      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 1.6);

      osc.start(start);
      osc.stop(start + 1.6);
    });

    setTimeout(() => ctx.close(), 3000);
  } catch (err) {
    console.warn("Web Audio API not available:", err);
  }
}
