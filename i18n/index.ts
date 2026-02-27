import en from "./locales/en";
import es from "./locales/es";
import type { Translations } from "./types";

export type { Translations };

export type Locale = "en" | "es";

export interface LocaleConfig {
  code: Locale;
  label: string;
  countryCode: string;
}

export const locales: LocaleConfig[] = [
  { code: "en", label: "English", countryCode: "gb" },
  { code: "es", label: "Español", countryCode: "es" },
];

export const translations: Record<Locale, Translations> = { en, es };
