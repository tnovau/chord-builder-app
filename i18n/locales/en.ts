import type { Translations } from "../types";

const en: Translations = {
  header: {
    subtitle: "Music Theory Tool",
    tagline: "Enter notes · Identify the chord · Visualize on the fretboard",
  },
  chordBuilder: {
    identifyChord: "♩ Identify Chord",
    errorMinNotes: "Enter at least 2 notes",
    errorNotRecognized: "No chord recognized with those notes",
    position: "Position",
    noPositions: "No positions",
    notes: "Notes",
    intervals: "Intervals",
    playing: "♩ Playing…",
    playChord: "▶  Play chord",
    emptyTitle: "Enter the notes of a chord\nto identify and visualize it",
    emptyExample: "Example: F + Eb + A + C# → F7(#5)",
  },
  noteInput: {
    label: "Chord notes",
    placeholder: "Type a note (e.g.: F, Eb, A#)…",
    errorInvalidNote: "is not a valid note",
    errorAlreadyAdded: "is already added",
    errorMaxNotes: "Maximum 6 notes",
  },
} satisfies Translations;

export default en;
