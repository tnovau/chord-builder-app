import { NextRequest, NextResponse } from "next/server";
import { identifyChord } from "@/lib/music";
import { findChordPositions } from "@/lib/fretboard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const notes: string[] = body?.notes;

    if (!Array.isArray(notes) || notes.length < 2) {
      return NextResponse.json(
        { error: "Provide at least 2 notes in a 'notes' array." },
        { status: 400 }
      );
    }

    const chords = identifyChord(notes);

    if (!chords) {
      return NextResponse.json(
        { error: "No chord recognized for the given notes." },
        { status: 422 }
      );
    }

    // Attach positions for the first (most likely) chord
    const positions = findChordPositions(chords[0].notes);

    return NextResponse.json({ chords, positions });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
