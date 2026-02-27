"use client";

import { CircleFlag } from "react-circle-flags";
import { useLanguage } from "@/i18n/LanguageContext";
import { locales } from "@/i18n";
import Link from "next/link";

export default function LanguageSelector() {
  const { locale } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <Link
          key={l.code}
          href={`/${l.code}`}
          title={l.label}
          className={`rounded-full transition-all ${
            locale === l.code
              ? "ring-2 ring-wood-300 scale-110"
              : "opacity-50 hover:opacity-80"
          }`}
        >
          <CircleFlag countryCode={l.countryCode} height={36} width={36} />
        </Link>
      ))}
    </div>
  );
}
