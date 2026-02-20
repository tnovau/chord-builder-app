import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
