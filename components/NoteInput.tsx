"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { normalizeNote } from "@/lib/music";
import { useLanguage } from "@/i18n/LanguageContext";

const QUICK_NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;

interface Props {
  notes: string[];
  onChange: (notes: string[]) => void;
  error?: string;
  onErrorChange: (err: string) => void;
}

export default function NoteInput({ notes, onChange, error, onErrorChange }: Props) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addNote = (raw: string) => {
    const note = normalizeNote(raw);
    if (!note) { onErrorChange(`"${raw}" ${t.noteInput.errorInvalidNote}`); return; }
    if (notes.includes(note)) { onErrorChange(`${note} ${t.noteInput.errorAlreadyAdded}`); return; }
    if (notes.length >= 6) { onErrorChange(t.noteInput.errorMaxNotes); return; }
    onErrorChange("");
    onChange([...notes, note]);
  };

  const removeNote = (index: number) => {
    onChange(notes.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      if (input.trim()) { addNote(input.trim()); setInput(""); }
    }
    if (e.key === "Backspace" && !input && notes.length > 0) {
      removeNote(notes.length - 1);
    }
  };

  return (
    <div>
      <label className="block text-[11px] tracking-[4px] text-wood-400 uppercase mb-4 font-source">
        {t.noteInput.label}
      </label>

      {/* Chip input */}
      <div
        className="flex flex-wrap gap-2 items-center bg-transparent border border-wood-700 rounded-xl px-3 py-2 min-h-[48px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {notes.map((note, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-gradient-to-br from-wood-800 to-wood-700 border border-wood-600/30 rounded-full px-3 py-1 text-wood-200 text-sm font-serif animate-chip"
          >
            {note}
            <button
              onClick={(e) => { e.stopPropagation(); removeNote(i); }}
              className="text-wood-400 hover:text-wood-300 leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); onErrorChange(""); }}
          onKeyDown={handleKeyDown}
          placeholder={notes.length === 0 ? t.noteInput.placeholder : ""}
          className="bg-transparent border-none outline-none text-wood-50 text-sm font-serif flex-1 min-w-[140px] placeholder:text-wood-600"
          list="note-datalist"
        />
        <datalist id="note-datalist">
          {["C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B"].map(n => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      {/* Quick picker */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {QUICK_NOTES.map((n) => (
          <button
            key={n}
            onClick={() => addNote(n)}
            className="bg-wood-900 border border-wood-700 hover:border-wood-200/30 hover:bg-wood-200/10 rounded-lg px-2.5 py-1 text-wood-200 text-xs font-serif transition-all"
          >
            {n}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-2 italic">⚠ {error}</p>
      )}
    </div>
  );
}
