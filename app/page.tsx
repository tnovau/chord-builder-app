import ChordBuilder from "@/components/ChordBuilder";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center px-6 py-12 border-b border-wood-800/50">
        <p className="text-[11px] tracking-[6px] text-wood-400 uppercase mb-3 font-source">
          Music Theory Tool
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl font-bold bg-gradient-to-r from-wood-50 via-wood-200 to-wood-50 bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_4s_linear_infinite]">
          ChordBuilder
        </h1>
        <p className="text-wood-500 text-sm mt-2 font-source font-light">
          Introduce notas · Identifica el acorde · Visualiza en el mástil
        </p>
      </header>

      {/* Top Ad */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <AdBanner slot="YOUR_AD_SLOT_1" format="horizontal" className="min-h-[90px]" />
      </div>

      {/* Main app */}
      <ChordBuilder />

      {/* Bottom Ad */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <AdBanner slot="YOUR_AD_SLOT_2" format="horizontal" className="min-h-[90px]" />
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-wood-900 text-wood-800 text-[11px] tracking-[2px] font-source">
        CHORDBUILDER · MVP v0.1 · NEXT.JS + TYPESCRIPT
      </footer>
    </div>
  );
}
