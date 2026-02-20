import type { NoteName, ChordFormula, IdentifiedChord } from "@/types/music";

// ── Constants ─────────────────────────────────────────────────────────────────

export const NOTE_ORDER: NoteName[] = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

const ENHARMONIC: Record<string, NoteName> = {
  Db: "C#", Eb: "D#", Fb: "E", Gb: "F#",
  Ab: "G#", Bb: "A#", Cb: "B", "E#": "F", "B#": "C",
};

export const CHORD_FORMULAS: ChordFormula[] = [
  { name: "maj",       intervals: [0, 4, 7],        symbol: ""        },
  { name: "min",       intervals: [0, 3, 7],        symbol: "m"       },
  { name: "dim",       intervals: [0, 3, 6],        symbol: "°"       },
  { name: "aug",       intervals: [0, 4, 8],        symbol: "+"       },
  { name: "sus2",      intervals: [0, 2, 7],        symbol: "sus2"    },
  { name: "sus4",      intervals: [0, 5, 7],        symbol: "sus4"    },
  { name: "7",         intervals: [0, 4, 7, 10],    symbol: "7"       },
  { name: "maj7",      intervals: [0, 4, 7, 11],    symbol: "M7"      },
  { name: "min7",      intervals: [0, 3, 7, 10],    symbol: "m7"      },
  { name: "min(maj7)", intervals: [0, 3, 7, 11],    symbol: "m(M7)"   },
  { name: "dim7",      intervals: [0, 3, 6, 9],     symbol: "°7"      },
  { name: "m7b5",      intervals: [0, 3, 6, 10],    symbol: "ø7"      },
  { name: "7(#5)",     intervals: [0, 4, 8, 10],    symbol: "7(#5)"   },
  { name: "7(b5)",     intervals: [0, 4, 6, 10],    symbol: "7(b5)"   },
  { name: "maj7(#5)",  intervals: [0, 4, 8, 11],    symbol: "M7(#5)"  },
  { name: "9",         intervals: [0, 4, 7, 10, 2], symbol: "9"       },
  { name: "maj9",      intervals: [0, 4, 7, 11, 2], symbol: "M9"      },
  { name: "min9",      intervals: [0, 3, 7, 10, 2], symbol: "m9"      },
  { name: "6",         intervals: [0, 4, 7, 9],     symbol: "6"       },
  { name: "min6",      intervals: [0, 3, 7, 9],     symbol: "m6"      },
  { name: "add9",      intervals: [0, 4, 7, 2],     symbol: "add9"    },
  { name: "7sus4",     intervals: [0, 5, 7, 10],    symbol: "7sus4"   },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

export function normalizeNote(input: string): NoteName | null {
  if (!input?.trim()) return null;
  const canonical = input.trim().charAt(0).toUpperCase() + input.trim().slice(1);
  const resolved = ENHARMONIC[canonical] ?? canonical;
  return NOTE_ORDER.includes(resolved as NoteName)
    ? (resolved as NoteName)
    : null;
}

export function noteToIndex(note: string): number {
  const n = normalizeNote(note);
  return n ? NOTE_ORDER.indexOf(n) : -1;
}

export function semitonesBetween(root: string, note: string): number {
  const r = noteToIndex(root);
  const n = noteToIndex(note);
  if (r === -1 || n === -1) return -1;
  return (n - r + 12) % 12;
}

// ── Chord identification ──────────────────────────────────────────────────────

export function identifyChord(rawNotes: string[]): IdentifiedChord[] | null {
  const normalized = rawNotes
    .map(normalizeNote)
    .filter((n): n is NoteName => n !== null);

  // Remove duplicates
  const unique = [...Array.from(new Set(normalized))];
  if (unique.length < 2) return null;

  const results: IdentifiedChord[] = [];

  for (const root of unique) {
    const intervalsFromRoot = unique.map((n) => semitonesBetween(root, n));
    const noteSet = new Set(intervalsFromRoot);

    for (const formula of CHORD_FORMULAS) {
      const formulaSet = new Set(formula.intervals.map((i) => i % 12));

      const allFormulaNotesPresent = [...Array.from(formulaSet)].every((i) => noteSet.has(i));
      const noExtraNotes = [...Array.from(noteSet)].every((i) => formulaSet.has(i));

      if (allFormulaNotesPresent && noExtraNotes) {
        results.push({
          root,
          name: `${root}${formula.symbol}`,
          formula: formula.name,
          symbol: formula.symbol,
          intervals: formula.intervals,
          notes: unique,
        });
      }
    }
  }

  return results.length > 0 ? results : null;
}
