import { NOTE_ORDER, normalizeNote } from "./music";
import type { ChordPosition, FretValue, BarreInfo } from "@/types/music";

// Standard tuning E2 A2 D3 G3 B3 E4 — stored as semitone index (C=0)
export const OPEN_STRINGS = [4, 9, 2, 7, 11, 4] as const; // E A D G B E
export const STRING_LABELS = ["E", "A", "D", "G", "B", "e"] as const;

export function noteAtFret(stringIndex: number, fret: number): number {
  return (OPEN_STRINGS[stringIndex] + fret) % 12;
}

function detectBarre(frets: FretValue[]): BarreInfo | null {
  const played = frets
    .map((f, i) => ({ f, i }))
    .filter((x): x is { f: number; i: number } => x.f !== null && x.f > 0);

  if (played.length < 2) return null;
  const minFret = Math.min(...played.map((x) => x.f));
  const atMin = played.filter((x) => x.f === minFret);

  if (atMin.length >= 3) {
    return {
      fret: minFret,
      fromString: Math.min(...atMin.map((x) => x.i)),
      toString: Math.max(...atMin.map((x) => x.i)),
    };
  }
  return null;
}

function ergonomyScore(frets: FretValue[]): number {
  const played = frets.filter((f): f is number => f !== null && f > 0);
  if (played.length === 0) return 0;
  const minFret = Math.min(...played);
  const span = Math.max(...played) - minFret;
  const stringCount = frets.filter((f) => f !== null).length;
  // Lower frets = better, more strings = better, less span = better
  return minFret * 3 - stringCount * 2 + span * 1;
}

export function findChordPositions(
  chordNotes: string[],
  maxResults = 5
): ChordPosition[] {
  const targetSet = new Set(
    chordNotes
      .map(normalizeNote)
      .filter((n) => n !== null)
      .map((n) => NOTE_ORDER.indexOf(n))
      .filter((i) => i >= 0)
  );

  if (targetSet.size === 0) return [];

  const positions: ChordPosition[] = [];
  const seen = new Set<string>();

  for (let windowStart = 0; windowStart <= 12; windowStart++) {
    const windowEnd = windowStart === 0 ? 4 : windowStart + 3;

    // For each string, collect valid fret options (null=mute or matching note)
    const options: FretValue[][] = OPEN_STRINGS.map((_, si) => {
      const opts: FretValue[] = [null];
      for (let f = windowStart === 0 ? 0 : windowStart; f <= windowEnd; f++) {
        if (targetSet.has(noteAtFret(si, f))) opts.push(f);
      }
      return opts;
    });

    // Recursive combinator (prune early)
    const combine = (si: number, current: FretValue[]): void => {
      if (positions.length >= maxResults * 4) return;

      if (si === 6) {
        const played = current.filter((f): f is number => f !== null);
        if (played.length < 3) return;

        // Verify all target notes are covered
        const covered = new Set(
          current.map((f, i) => (f !== null ? noteAtFret(i, f) : -1))
        );
        if (!Array.from(targetSet).every((n) => covered.has(n))) return;

        // Span check (max 4 frets between non-zero frets)
        const nonOpen = played.filter((f) => f > 0);
        if (nonOpen.length > 1) {
          const span = Math.max(...nonOpen) - Math.min(...nonOpen);
          if (span > 4) return;
        }

        const key = current.join(",");
        if (seen.has(key)) return;
        seen.add(key);

        const nonZero = played.filter((f) => f > 0);
        positions.push({
          frets: [...current],
          startFret: nonZero.length > 0 ? Math.min(...nonZero) : 1,
          barre: detectBarre([...current]),
        });
        return;
      }

      for (const opt of options[si]) {
        current.push(opt);
        combine(si + 1, current);
        current.pop();
      }
    };

    combine(0, []);
  }

  // Sort by ergonomy and return top results
  positions.sort((a, b) => ergonomyScore(a.frets) - ergonomyScore(b.frets));
  return positions.slice(0, maxResults);
}
