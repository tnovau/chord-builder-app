"use client";

import ChordBuilder from "@/components/ChordBuilder";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center px-6 py-12 border-b border-wood-800/50 relative">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <p className="text-[11px] tracking-[6px] text-wood-400 uppercase mb-3 font-source">
          {t.header.subtitle}
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl font-bold bg-gradient-to-r from-wood-50 via-wood-200 to-wood-50 bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_4s_linear_infinite]">
          ChordBuilder
        </h1>
        <p className="text-wood-500 text-sm mt-2 font-source font-light">
          {t.header.tagline}
        </p>
      </header>

      <ChordBuilder />

      <div id="container-2ae7f8603b6d8054178355ae94c4e0d5"></div>

      <footer className="text-center py-6 border-t border-wood-900 text-wood-600 text-[11px] tracking-[2px] font-source">
        CHORDBUILDER
      </footer>
    </div>
  );
}
