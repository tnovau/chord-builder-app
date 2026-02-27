"use client";

import { CircleFlag } from "react-circle-flags";
import { useLanguage } from "@/i18n/LanguageContext";
import { locales } from "@/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSelector() {
  const { locale } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <Link
          key={l.code}
          href={pathname.replace(`/${locale}`, `/${l.code}`)}
          title={l.label}
          className={`rounded-full transition-all ${
            locale === l.code
              ? "ring-2 ring-wood-300 scale-110"
              : "opacity-50 hover:opacity-80"
          }`}
          aria-current={locale === l.code ? "true" : undefined}
        >
          <CircleFlag countryCode={l.countryCode} height={36} width={36} />
        </Link>
      ))}
    </div>
  );
}
