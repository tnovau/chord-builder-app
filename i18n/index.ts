import en from "./locales/en";
import es from "./locales/es";
import type { Translations } from "./types";

export type { Translations };

const ENGLISH = 'en'
const SPANISH = 'es'

export type Locale = typeof ENGLISH | typeof SPANISH;

export interface LocaleConfig {
  code: Locale;
  label: string;
  countryCode: string;
}

export const locales: LocaleConfig[] = [
  { code: ENGLISH, label: "English", countryCode: "gb" },
  { code: SPANISH, label: "Español", countryCode: "es" },
];

export const translations: Record<Locale, Translations> = { en, es };

export const defaultLocale = ENGLISH
