import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#fcfcfb", dark: "#1a1a19" },
        plane: { DEFAULT: "#f9f9f7", dark: "#0d0d0d" },
        ink: {
          primary: { DEFAULT: "#0b0b0b", dark: "#ffffff" },
          secondary: { DEFAULT: "#52514e", dark: "#c3c2b7" },
          muted: "#898781",
        },
        grid: { DEFAULT: "#e1e0d9", dark: "#2c2c2a" },
        baseline: { DEFAULT: "#c3c2b7", dark: "#383835" },
        akash: { DEFAULT: "#2a78d6", dark: "#3987e5" },
        viraaj: { DEFAULT: "#eb6834", dark: "#d95926" },
        status: {
          good: "#0ca30c",
          warning: "#fab219",
          serious: "#ec835a",
          critical: "#d03b3b",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
