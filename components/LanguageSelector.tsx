"use client";

import { CircleFlag } from "react-circle-flags";
import { useLanguage } from "@/i18n/LanguageContext";
import { locales } from "@/i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          title={l.label}
          className={`rounded-full transition-all ${
            locale === l.code
              ? "ring-2 ring-wood-300 scale-110"
              : "opacity-50 hover:opacity-80"
          }`}
        >
          <CircleFlag countryCode={l.countryCode} height="24" />
        </button>
      ))}
    </div>
  );
}
