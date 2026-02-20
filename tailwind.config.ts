import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        source: ["var(--font-source)", "Georgia", "serif"],
      },
      colors: {
        wood: {
          50:  "#f5ede0",
          100: "#e8d5b7",
          200: "#C9A96E",
          300: "#b8941f",
          400: "#8B4513",
          500: "#6b5040",
          600: "#4a3728",
          700: "#3d2410",
          800: "#2a1a0e",
          900: "#1a0d07",
          950: "#0d0804",
        },
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        shimmer: "shimmer 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
