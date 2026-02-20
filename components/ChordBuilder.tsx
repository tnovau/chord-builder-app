"use client";

import { useState, useCallback } from "react";
import NoteInput from "./NoteInput";
import ChordDiagram from "./ChordDiagram";
import { identifyChord } from "@/lib/music";
import { findChordPositions } from "@/lib/fretboard";
import { playChord } from "@/lib/audio";
import type { IdentifiedChord, ChordPosition } from "@/types/music";

const INTERVAL_NAMES = ["1","b2","2","b3","3","4","b5","5","#5","6","b7","7"];

export default function ChordBuilder() {
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [chords, setChords] = useState<IdentifiedChord[] | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [positions, setPositions] = useState<ChordPosition[]>([]);
  const [posIdx, setPosIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleNotesChange = useCallback((newNotes: string[]) => {
    setNotes(newNotes);
    setAnalyzed(false);
  }, []);

  const analyze = () => {
    if (notes.length < 2) { setError("Introduce al menos 2 notas"); return; }
    setError("");
    const result = identifyChord(notes);
    if (!result) {
      setChords(null);
      setError("No se reconoció ningún acorde con esas notas");
      return;
    }
    setChords(result);
    setSelectedIdx(0);
    setPositions(findChordPositions(result[0].notes));
    setPosIdx(0);
    setAnalyzed(true);
  };

  const selectChord = (idx: number) => {
    if (!chords) return;
    setSelectedIdx(idx);
    setPositions(findChordPositions(chords[idx].notes));
    setPosIdx(0);
  };

  const handlePlay = () => {
    if (playing || !chords) return;
    setPlaying(true);
    playChord(chords[selectedIdx].notes);
    setTimeout(() => setPlaying(false), 1800);
  };

  const reset = () => {
    setNotes([]);
    setChords(null);
    setPositions([]);
    setError("");
    setAnalyzed(false);
    setSelectedIdx(0);
    setPosIdx(0);
  };

  const activeChord = chords?.[selectedIdx];

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">

      {/* ── Input section ── */}
      <section className="bg-gradient-to-br from-wood-900 to-wood-950 border border-wood-800 rounded-2xl p-7 mb-7">
        <NoteInput
          notes={notes}
          onChange={handleNotesChange}
          error={error}
          onErrorChange={setError}
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={analyze}
            disabled={notes.length < 2}
            className="flex-1 bg-gradient-to-r from-wood-300 to-wood-200 disabled:from-wood-800 disabled:to-wood-800 disabled:text-wood-600 text-wood-950 font-bold font-playfair text-sm rounded-xl py-3 px-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.25)] disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            ♩ Identificar Acorde
          </button>
          <button
            onClick={reset}
            className="bg-transparent border border-wood-700 text-wood-500 hover:text-wood-300 hover:border-wood-500 rounded-xl px-4 py-3 transition-all text-sm font-serif"
          >
            ↺
          </button>
        </div>
      </section>

      {/* ── Results ── */}
      {analyzed && chords && activeChord && (
        <div className="animate-fade-up">

          {/* Chord tabs */}
          {chords.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-5">
              {chords.map((c, i) => (
                <button
                  key={i}
                  onClick={() => selectChord(i)}
                  className={`rounded-xl px-4 py-2 text-lg font-playfair font-bold transition-all hover:-translate-y-0.5 ${
                    i === selectedIdx
                      ? "bg-gradient-to-r from-wood-300 to-wood-200 text-wood-950 border border-wood-200"
                      : "bg-wood-900 border border-wood-700 text-wood-200 hover:border-wood-400"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Main card */}
          <div className="bg-gradient-to-br from-wood-900 to-wood-950 border border-wood-800 rounded-2xl p-7 grid grid-cols-[auto_1fr] gap-8">

            {/* Diagram column */}
            <div>
              <p className="text-[10px] tracking-[3px] text-wood-400 uppercase mb-3 font-source">
                Posición {posIdx + 1} / {positions.length}
              </p>

              <div className="bg-gradient-to-br from-wood-800 to-wood-900 border border-wood-700 rounded-xl p-4">
                {positions.length > 0 ? (
                  <ChordDiagram
                    position={positions[posIdx]}
                    rootNote={activeChord.root}
                  />
                ) : (
                  <div className="w-40 h-44 flex items-center justify-center text-wood-600 text-xs italic">
                    Sin posiciones
                  </div>
                )}
              </div>

              {/* Position navigation */}
              {positions.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={() => setPosIdx((i) => Math.max(0, i - 1))}
                    disabled={posIdx === 0}
                    className="border border-wood-700 rounded-lg px-3 py-1 text-wood-200 disabled:text-wood-700 disabled:cursor-not-allowed transition-colors text-base"
                  >
                    ‹
                  </button>
                  {positions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPosIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === posIdx ? "bg-wood-200 scale-125" : "bg-wood-700"
                      }`}
                    />
                  ))}
                  <button
                    onClick={() => setPosIdx((i) => Math.min(positions.length - 1, i + 1))}
                    disabled={posIdx === positions.length - 1}
                    className="border border-wood-700 rounded-lg px-3 py-1 text-wood-200 disabled:text-wood-700 disabled:cursor-not-allowed transition-colors text-base"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* Info column */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="font-playfair text-5xl font-bold text-wood-200 mb-1">
                  {activeChord.name}
                </h2>
                <p className="text-wood-500 text-sm italic mb-6">{activeChord.formula}</p>

                {/* Notes */}
                <div className="mb-5">
                  <p className="text-[10px] tracking-[3px] text-wood-400 uppercase mb-2 font-source">Notas</p>
                  <div className="flex flex-wrap gap-2">
                    {activeChord.notes.map((n, i) => (
                      <span
                        key={i}
                        className={`rounded-lg px-3 py-1 text-sm font-serif border ${
                          i === 0
                            ? "bg-wood-200/20 border-wood-200 text-wood-200"
                            : "bg-wood-900 border-wood-700 text-wood-50"
                        }`}
                      >
                        {n}{i === 0 ? " ♩" : ""}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Intervals */}
                <div>
                  <p className="text-[10px] tracking-[3px] text-wood-400 uppercase mb-2 font-source">Intervalos</p>
                  <div className="flex flex-wrap gap-2">
                    {activeChord.intervals.map((iv, i) => (
                      <span key={i} className="bg-wood-900 border border-wood-700 rounded-md px-2.5 py-1 text-wood-400 text-xs font-serif">
                        {INTERVAL_NAMES[iv % 12]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={handlePlay}
                disabled={playing}
                className={`mt-6 border border-wood-600/40 rounded-xl py-3.5 px-5 text-sm font-playfair transition-all flex items-center justify-center gap-2 ${
                  playing
                    ? "text-wood-500 cursor-not-allowed animate-pulse"
                    : "text-wood-200 hover:border-wood-400 hover:bg-wood-200/5"
                }`}
              >
                {playing ? "♩ Reproduciendo…" : "▶  Escuchar acorde"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!analyzed && notes.length === 0 && (
        <div className="text-center py-16 text-wood-700">
          <div className="text-5xl mb-4">♬</div>
          <p className="font-playfair text-xl italic">
            Introduce las notas de un acorde<br />para identificarlo y visualizarlo
          </p>
          <p className="text-xs mt-3 text-wood-800">
            Ejemplo: F + Eb + A + C# → F7(#5)
          </p>
        </div>
      )}
    </main>
  );
}
