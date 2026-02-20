"use client";

import { NOTE_ORDER, normalizeNote } from "@/lib/music";
import { noteAtFret, STRING_LABELS } from "@/lib/fretboard";
import type { ChordPosition } from "@/types/music";

interface Props {
  position: ChordPosition;
  rootNote: string;
}

const INTERVAL_NAMES = ["1","b2","2","b3","3","4","b5","5","#5","6","b7","7"];

const W = 200, H = 220;
const PAD_L = 30, PAD_T = 50, PAD_R = 20, PAD_B = 22;
const FRET_COUNT = 5;
const STRING_COUNT = 6;
const COL_W = (W - PAD_L - PAD_R) / (STRING_COUNT - 1);
const ROW_H = (H - PAD_T - PAD_B) / FRET_COUNT;

export default function ChordDiagram({ position, rootNote }: Props) {
  const { frets, barre, startFret } = position;

  const nonZeroFrets = frets.filter((f): f is number => f !== null && f > 0);
  const minFret = nonZeroFrets.length > 0 ? Math.min(...nonZeroFrets) : 1;
  const displayStart = minFret > 1 ? minFret - 1 : 1;
  const showNut = minFret <= 1;

  const rootIndex = NOTE_ORDER.indexOf(normalizeNote(rootNote) ?? "C");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 200 }}>
      {/* Nut */}
      {showNut ? (
        <rect
          x={PAD_L} y={PAD_T - 4}
          width={(STRING_COUNT - 1) * COL_W} height={5}
          fill="#C9A96E" rx={2}
        />
      ) : (
        <text
          x={PAD_L - 8} y={PAD_T + ROW_H * 0.65}
          fontSize={11} fill="#C9A96E"
          textAnchor="middle" fontFamily="Georgia"
        >
          {displayStart}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: FRET_COUNT + 1 }).map((_, fi) => (
        <line
          key={fi}
          x1={PAD_L} y1={PAD_T + fi * ROW_H}
          x2={PAD_L + (STRING_COUNT - 1) * COL_W} y2={PAD_T + fi * ROW_H}
          stroke="#4a3728" strokeWidth={fi === 0 ? 2 : 1}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: STRING_COUNT }).map((_, si) => (
        <line
          key={si}
          x1={PAD_L + si * COL_W} y1={PAD_T}
          x2={PAD_L + si * COL_W} y2={PAD_T + FRET_COUNT * ROW_H}
          stroke="#6b5040" strokeWidth={1 + (5 - si) * 0.15}
        />
      ))}

      {/* Barre */}
      {barre &&
        barre.fret >= displayStart &&
        barre.fret < displayStart + FRET_COUNT && (
          <rect
            x={PAD_L + barre.fromString * COL_W - 8}
            y={PAD_T + (barre.fret - displayStart) * ROW_H - ROW_H + ROW_H * 0.25}
            width={(barre.toString - barre.fromString) * COL_W + 16}
            height={ROW_H * 0.5}
            rx={10} fill="#C9A96E" opacity={0.9}
          />
        )}

      {/* Finger dots */}
      {frets.map((fret, si) => {
        if (fret === null) return null;

        // Open string indicator
        if (fret === 0) {
          return (
            <circle
              key={si}
              cx={PAD_L + si * COL_W} cy={PAD_T - 14}
              r={6} fill="none" stroke="#C9A96E" strokeWidth={1.5}
            />
          );
        }

        const relFret = fret - displayStart + 1;
        if (relFret < 1 || relFret > FRET_COUNT) return null;

        const cx = PAD_L + si * COL_W;
        const cy = PAD_T + (relFret - 1) * ROW_H + ROW_H * 0.5;
        const noteIdx = noteAtFret(si, fret);
        const isRoot = noteIdx === rootIndex;
        const noteName = NOTE_ORDER[noteIdx];

        return (
          <g key={si}>
            <circle
              cx={cx} cy={cy} r={ROW_H * 0.35}
              fill={isRoot ? "#C9A96E" : "#8B4513"}
              stroke="#C9A96E" strokeWidth={isRoot ? 1.5 : 0.5}
            />
            <text
              x={cx} y={cy + 4}
              textAnchor="middle" fontSize={8}
              fill={isRoot ? "#1a0f0a" : "#f0e6d3"}
              fontFamily="Georgia"
            >
              {noteName}
            </text>
          </g>
        );
      })}

      {/* Muted string X markers */}
      {frets.map((fret, si) => {
        if (fret !== null) return null;
        const cx = PAD_L + si * COL_W;
        return (
          <g key={si}>
            <line x1={cx - 5} y1={PAD_T - 19} x2={cx + 5} y2={PAD_T - 9} stroke="#8B4513" strokeWidth={1.5} />
            <line x1={cx + 5} y1={PAD_T - 19} x2={cx - 5} y2={PAD_T - 9} stroke="#8B4513" strokeWidth={1.5} />
          </g>
        );
      })}

      {/* String labels */}
      {STRING_LABELS.map((label, si) => (
        <text
          key={si}
          x={PAD_L + si * COL_W} y={H - 5}
          textAnchor="middle" fontSize={9}
          fill="#6b5040" fontFamily="Georgia"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
