/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10A37F",
          600: "#0E8F70",
          700: "#0C7C62",
          800: "#0A6753",
          accent: "#22D3A3",
          "accent-700": "#14B08A",
        },
        neutral: {
          0: "#0B0F13",
          50: "#0F141A",
          100: "#131A21",
          200: "#1A232C",
          300: "#253140",
          400: "#3B4756",
          500: "#64748B",
          600: "#94A3B8",
          700: "#CBD5E1",
          800: "#E2E8F0",
          900: "#F8FAFC",
        },
        semantic: {
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#38BDF8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
        ],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "18px", letterSpacing: "-0.01em" }],
        sm: ["14px", { lineHeight: "20px", letterSpacing: "-0.005em" }],
        base: ["16px", { lineHeight: "24px", letterSpacing: "0em" }],
        lg: ["18px", { lineHeight: "28px", letterSpacing: "0em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "0em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.002em" }],
        "3xl": ["30px", { lineHeight: "38px", letterSpacing: "-0.003em" }],
        "4xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.005em" }],
        "5xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      boxShadow: {
        "soft-1":
          "0 1px 2px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04) inset",
        "soft-2": "0 6px 24px rgba(0,0,0,0.35)",
        elevated: "0 12px 48px rgba(0,0,0,0.45)",
        "glow-brand":
          "0 0 0 4px rgba(16,163,127,0.2), 0 0 24px rgba(16,163,127,0.35)",
      },
      backdropBlur: {
        sm: "4px",
        md: "8px",
        lg: "16px",
      },
      animation: {
        "fade-up": "fade-up 0.26s ease-out",
        "hover-tilt": "hover-tilt 0.9s ease-out",
        glitch: "glitch 0.2s ease-out",
        "pulse-glow": "pulse-glow 1.2s ease-out",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        "hover-tilt": [
          { transform: "rotateX(0deg) rotateY(0deg)" },
          { transform: "rotateX(3deg) rotateY(-3deg)" },
          { transform: "rotateX(-2deg) rotateY(2deg)" },
          { transform: "rotateX(0deg) rotateY(0deg)" },
        ],
        glitch: [
          { transform: "translate(0,0)", filter: "none" },
          { transform: "translate(-2px, 1px)", clipPath: "inset(10% 0 12% 0)" },
          { transform: "translate(2px, -1px)", clipPath: "inset(60% 0 8% 0)" },
          { transform: "translate(0,0)", filter: "none" },
        ],
        "pulse-glow": [
          { boxShadow: "0 0 0 0 rgba(16,163,127,0.65)" },
          { boxShadow: "0 0 0 12px rgba(16,163,127,0.0)" },
        ],
      },
      maxWidth: {
        container: "1200px",
        content: "880px",
      },
      height: {
        navbar: "64px",
        hero: "640px",
        footer: "320px",
      },
      width: {
        sidebar: "320px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
