import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        // the one non-Helvetica face: decorative script on the Experiences cards
        script: ["Island Moments", "cursive"],
      },

      /* Design 1 type scale. Mirrors the --text-* custom properties in
         tokens.css; keep the two in step. Sizes that only specified a size and
         tracking deliberately omit lineHeight/fontWeight so the call site keeps
         setting its own. */
      fontSize: {
        nav: ["16px", { lineHeight: "154%", letterSpacing: "0em", fontWeight: "500" }],
        svc: ["16px", { lineHeight: "100%", letterSpacing: "-0.04em", fontWeight: "500" }],
        faq: ["22px", { lineHeight: "32px", letterSpacing: "0em", fontWeight: "700" }],
        tile: ["22.62px", { lineHeight: "100%", letterSpacing: "0em", fontWeight: "400" }],
        script: ["114.73px", { lineHeight: "100%", letterSpacing: "0em", fontWeight: "400" }],
        "script-sm": ["43.85px", { lineHeight: "100%", letterSpacing: "0em", fontWeight: "400" }],
        display: ["64px", { letterSpacing: "-0.04em" }],
        "card-title": ["26px", { letterSpacing: "-0.04em" }],
        "card-sub": ["22px", { letterSpacing: "0em" }],
      },
      /* Tailwind v3 only ships a coarse opacity scale (0,5,10,20,25,…), so
         modifiers like `text-white/88` or `bg-white/14` — written against v4,
         which accepts any integer — silently generated NOTHING and the element
         fell back to inherited colour. Full 0-100 range restores v4 behaviour;
         JIT still only emits the values actually used. */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [i, String(i / 100)])
      ),
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        250: "250ms",
      },
      boxShadow: {
        float: "var(--shadow-float)",
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
        /* Heading ink. Deliberately NOT a remap of Tailwind's built-in `black`:
           that stays true #000 for the scrims and rings (bg-black/40,
           ring-black/5, from-black/80 …) which need real black at low alpha.
           Use `text-ink-black` for type. */
        "ink-black": "var(--black)",
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
        marquee: { to: { transform: "translateX(-50%)" } },
        trendSlide: { to: { transform: "translateX(calc(-1 * var(--loop, 50%)))" } },
        /* slow, subtle drift+zoom for the focused destination card's photo */
        kenBurns: {
          "0%": { transform: "scale(1.02) translate3d(0, 0, 0)" },
          "100%": { transform: "scale(1.09) translate3d(-1.5%, -1%, 0)" },
        },
        mtCardIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        /* cross-fade for the monthly cards: `both` fill so the incoming layer
           is already transparent before the first frame paints */
        mtDissolve: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        modalFade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        modalRise: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "none" },
        },
        exploreBob: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-9px) rotate(-1.6deg)" },
        },
        /* the lateral flip is baked in so the bob composes with it */
        faqBoatBob: {
          "0%, 100%": { transform: "scaleX(-1) translateY(0) rotate(0deg)" },
          "50%": { transform: "scaleX(-1) translateY(-7px) rotate(-1.5deg)" },
        },
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
        marquee: "marquee 42s linear infinite",
        "trend-slide": "trendSlide 65s linear infinite",
        "ken-burns": "kenBurns 14s ease-in-out infinite alternate",
        "mt-card-in": "mtCardIn 0.5s cubic-bezier(0.22,1,0.36,1)",
        "mt-dissolve": "mtDissolve 0.55s cubic-bezier(0.22,1,0.36,1) both",
        "modal-fade": "modalFade 0.3s cubic-bezier(0.22,1,0.36,1)",
        "modal-rise": "modalRise 0.4s cubic-bezier(0.22,1,0.36,1)",
        "explore-bob": "exploreBob 7s ease-in-out infinite",
        "faq-boat-bob": "faqBoatBob 7s ease-in-out infinite",
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
