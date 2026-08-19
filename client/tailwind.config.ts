import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nvn: {
          black: "#050505",
          charcoal: "#0D0D0D",
          panel: "#131313",
          line: "#232323",
          silver: "#8A8A8A",
          white: "#F5F5F5",
          red: "#E10600",
          "red-dim": "#8C0400",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["'Bebas Neue'", "Manrope", "sans-serif"],
        arabic: ["'IBM Plex Sans Arabic'", "'Noto Kufi Arabic'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
} satisfies Config;
