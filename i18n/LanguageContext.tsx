"use client";

import { createContext, useContext, ReactNode } from "react";
import { type Locale, type Translations } from ".";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ locale, t, children }: { locale: Locale; children: ReactNode; t: Translations }) {
  return (
    <LanguageContext.Provider value={{ locale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
