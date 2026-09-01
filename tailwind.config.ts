import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — layered blacks, not one flat dark
        ink: "#050506",
        obsidian: "#0A0A0C",
        charcoal: "#111114",
        graphite: "#191920",
        // Gold system
        gold: {
          DEFAULT: "#C9A15A",
          pale: "#EBD5A3",
          deep: "#9A7433",
          bronze: "#7A5C2E",
        },
        // Law-library leather — deep secondary, never bright
        oxblood: "#4A1A1F",
        // Warm paper for contrast sections
        vellum: "#EDE7DA",
        parchment: "#F7F3EA",
        bone: "#F2EFE8",
        smoke: "#86868C",
        ash: "#5A5A61",
      },
      fontFamily: {
        display: ["var(--font-display)", "Didot", "serif"],
        read: ["var(--font-read)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "10xl": ["9rem", { lineHeight: "0.86", letterSpacing: "-0.035em" }],
        "11xl": ["12rem", { lineHeight: "0.84", letterSpacing: "-0.04em" }],
      },
      letterSpacing: {
        docket: "0.42em",
        eyebrow: "0.26em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(115deg,#EBD5A3 0%,#C9A15A 38%,#9A7433 72%,#EBD5A3 100%)",
        "gold-sheen": "linear-gradient(100deg,transparent 20%,rgba(235,213,163,.6) 50%,transparent 80%)",
        "ledger": "repeating-linear-gradient(90deg,rgba(201,161,90,.05) 0 1px,transparent 1px 100%)",
      },
      boxShadow: {
        elevated: "0 40px 100px -40px rgba(0,0,0,.9)",
        "gold-glow": "0 0 0 1px rgba(201,161,90,.22),0 30px 80px -40px rgba(201,161,90,.4)",
      },
      keyframes: {
        sheen: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(220%)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        sheen: "sheen 2.4s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
