import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card-hsl))",
        "card-foreground": "hsl(var(--card-foreground-hsl))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border-hsl))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        navy: "hsl(var(--navy-hsl))",
        royal: "hsl(var(--royal-hsl))",
        azure: "hsl(var(--azure-hsl))",
        brand: "#2475EE",
        ink: "var(--ink)",
        saffron: "#F2662A",

        // Design 1 specific colors mapping to CSS variables scoped to .design-1-root
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        blue: "var(--blue)",
        "blue-ink": "var(--blue-ink)",
        "blue-deep": "var(--blue-deep)",
        "saffron-ink": "var(--blue-ink)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        "line-dark": "var(--line-dark)",
        "line-dark-strong": "var(--line-dark-strong)",
        "on-dark": "var(--on-dark)",
        "on-dark-soft": "var(--on-dark-soft)",
        "on-dark-faint": "var(--on-dark-faint)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        trainmove: {
          "0%": { transform: "translateX(-8%)" },
          "100%": { transform: "translateX(108%)" },
        },
        wheelspin: {
          to: { transform: "rotate(-360deg)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 #0d84c966" },
          "70%": { boxShadow: "0 0 0 12px #0d84c900" },
          "100%": { boxShadow: "0 0 #0d84c900" },
        },
        trainScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        launcherIn: {
          "0%": { opacity: "0", transform: "translateY(-14px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        tileIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        trainmove: "trainmove 14s linear infinite",
        wheelspin: "wheelspin 1.4s linear infinite",
        "pulse-ring": "pulseRing 2.2s infinite",
        trainScroll: "trainScroll 44s linear infinite",
        launcherIn: "launcherIn .22s cubic-bezier(.22,1,.36,1)",
        fadeIn: "fadeIn .2s ease-out",
        tileIn: "tileIn .3s ease-out backwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
