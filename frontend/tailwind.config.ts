import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Off-Navy — structural dark color (hero, footer, dark sections).
        // 900/950 are pinned to the brand's exact Off-Navy (#050A30).
        brand: {
          50: "#eef0f8",
          100: "#dce2f2",
          200: "#b8c1e3",
          300: "#8d99cd",
          400: "#5c6ba8",
          500: "#3a4680",
          600: "#252f5e",
          700: "#171e42",
          800: "#0f1533",
          900: "#0a0f38",
          950: "#050A30", // Off-Navy (exact)
        },
        // Antique Gold — the site's single accent/CTA color.
        gold: {
          50: "#faf6ef",
          100: "#f3ead9",
          200: "#e6d3b0",
          300: "#d6b783",
          400: "#c19a5c",
          500: "#a67f42",
          600: "#785D32", // Antique Gold (exact)
          700: "#5f4a28",
          800: "#4a391f",
          900: "#3a2d19",
          950: "#241c0f",
        },
        // Rough — dark brown, used as a hover-deepen for gold CTAs and
        // occasional warm-dark accents.
        rough: {
          50: "#f7ede9",
          100: "#efdbd3",
          200: "#d9ab98",
          300: "#c07d5f",
          400: "#96502f",
          500: "#6e3419",
          600: "#4f2410",
          700: "#3E160C", // Rough (exact)
          800: "#280d05",
          900: "#1c0904",
          950: "#120502",
        },
        // Pale — warm off-white, replaces pure white across light-mode
        // section backgrounds and cards.
        pale: {
          50: "#fdfbf7",
          100: "#f8f2e9",
          200: "#E8D9C4", // Pale (exact)
          300: "#dcc7a8",
          400: "#c9ac87",
          500: "#b08f66",
          600: "#8f714e",
          700: "#70583d",
          800: "#54402e",
          900: "#3a2c20",
          950: "#211810",
        },
        // Professional black / graphite scale — neutral text & borders,
        // pairs with any of the above.
        ink: {
          50: "#f5f6f8",
          100: "#e7e9ee",
          200: "#c7ccd6",
          300: "#9aa2b3",
          400: "#6b7387",
          500: "#4b5468",
          600: "#363e50",
          700: "#262c3b",
          800: "#171b26",
          900: "#0d1017",
          950: "#05070b",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(120,93,50,0.20) 0%, rgba(5,10,48,0) 60%)",
        "hero-mesh":
          "linear-gradient(135deg, #050A30 0%, #0d1450 55%, #050A30 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(120,93,50,0.22), 0 8px 40px -8px rgba(120,93,50,0.5)",
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
