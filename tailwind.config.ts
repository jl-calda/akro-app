import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        "line-strong": "var(--line-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        "ink-4": "var(--ink-4)",
        "ink-5": "var(--ink-5)",
        "ink-6": "var(--ink-6)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-fg": "var(--primary-fg)",
        "primary-soft": "var(--primary-soft)",
        "primary-soft-2": "var(--primary-soft-2)",
        "primary-line": "var(--primary-line)",
        hivis: "var(--hivis)",
        "hivis-ink": "var(--hivis-ink)",
        "hivis-soft": "var(--hivis-soft)",
        "hivis-line": "var(--hivis-line)",
        success: "var(--success)",
        "success-soft": "var(--success-soft)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
