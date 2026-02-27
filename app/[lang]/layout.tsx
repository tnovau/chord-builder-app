import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/i18n/LanguageContext";
import "../globals.css";
import { Locale, locales, Translations } from "@/i18n";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: "ChordBuilder — Identifica y visualiza acordes de guitarra",
  description: "Introduce notas, identifica el acorde y visualiza su posición en el mástil.",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale.code,
  }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  const translations = (await import(`@/i18n/locales/${lang}.json`)).default as Translations;
  return (
    <html lang={lang} className={`${playfair.variable} ${sourceSerif.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1140361060649944"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-1140361060649944"></meta>
      </head>
      <body>
        <LanguageProvider locale={lang as Locale} t={translations}>
          {children}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
