/** @type {import('tailwindcss').Config} */
const fontStack = ['"Plus Jakarta Sans"', '"Hind Siliguri"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"];

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: fontStack,
        // Kept so existing `font-Poppins` classes in the dashboard still resolve.
        Poppins: fontStack,
      },
      colors: {
        // Used by older dashboard pages (bg-primary buttons); aligned with the brand violet.
        primary: "#7c3aed",
        secondary: "#232830",
        // Brand palette, taken from the BEHB logo gradient.
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5dae2",
          300: "#b0b9c7",
          400: "#8592a6",
          500: "#66738a",
          600: "#515c71",
          700: "#424b5c",
          800: "#1e2533",
          900: "#111827",
          950: "#0b1020",
        },
        sun: "#fcd34d",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #22d3ee 0%, #8b5cf6 50%, #d946ef 100%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,.04), 0 4px 16px -4px rgba(16,24,40,.08)",
        lift: "0 2px 4px rgba(16,24,40,.04), 0 18px 40px -12px rgba(16,24,40,.22)",
        glow: "0 10px 30px -10px rgba(124,58,237,.55)",
      },
      borderRadius: {
        "4xl": "2rem",
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .4s ease-out both",
        "slow-zoom": "slow-zoom 2.4s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};
