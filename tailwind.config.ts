import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        internia: {
          primary: "#7a1128",
          primaryDark: "#5c0c1e",
          primarySoft: "#fdf2f3",
          border: "#e4e4e7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-thai)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        lift: "0 8px 24px -8px rgb(0 0 0 / 0.12), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
        crisp: "0 1px 1px 0 rgb(0 0 0 / 0.03), 0 2px 4px 0 rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
