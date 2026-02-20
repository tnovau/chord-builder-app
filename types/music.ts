// ── Music theory types ────────────────────────────────────────────────────────

export type NoteName =
  | "C" | "C#" | "D" | "D#" | "E" | "F"
  | "F#" | "G" | "G#" | "A" | "A#" | "B";

export type NoteInput = string; // User raw input (e.g. "Eb", "c#", "F")

export interface ChordFormula {
  name: string;       // e.g. "maj7"
  intervals: number[]; // semitones from root, e.g. [0, 4, 7, 11]
  symbol: string;     // display symbol, e.g. "M7"
}

export interface IdentifiedChord {
  root: NoteName;
  name: string;       // full name, e.g. "CM7"
  formula: string;    // formula name, e.g. "maj7"
  symbol: string;     // symbol, e.g. "M7"
  intervals: number[];
  notes: NoteName[];
}

// ── Guitar fretboard types ────────────────────────────────────────────────────

/** null = muted string, number = fret (0 = open) */
export type FretValue = number | null;

export interface BarreInfo {
  fret: number;
  fromString: number;
  toString: number;
}

export interface ChordPosition {
  frets: FretValue[];   // Array of 6 values, index 0 = low E string
  startFret: number;    // Lowest non-zero fret for display offset
  barre: BarreInfo | null;
}
