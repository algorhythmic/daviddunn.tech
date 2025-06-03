import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neobrutalism.dev inspired color palette
        "neo-blue": {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Primary blue from neobrutalism.dev
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        "neo-yellow": {
          light: "#fbbf24", // Warmer yellow for light mode
          dark: "#f59e0b", // Amber for dark mode
        },
        "neo-pink": {
          light: "#ec4899", // Hot pink
          dark: "#f97316", // Orange for dark mode contrast
        },
        "neo-cyan": {
          light: "#06b6d4", // Cyan
          dark: "#0891b2", // Darker cyan
        },
        "neo-green": {
          light: "#10b981", // Emerald
          dark: "#059669", // Darker emerald
        },
        "neo-red": {
          light: "#ef4444", // Red
          dark: "#dc2626", // Darker red
        },
        "neo-purple": {
          light: "#8b5cf6", // Violet
          dark: "#7c3aed", // Darker violet
        },
        // Theme-specific colors
        "theme-bg": "hsl(var(--theme-bg))",
        "theme-surface": "hsl(var(--theme-surface))",
        "theme-border": "hsl(var(--theme-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neo-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px #3b82f6, 0 0 40px #3b82f6, 8px 8px 0px 0px #000000",
          },
          "50%": {
            boxShadow: "0 0 30px #3b82f6, 0 0 60px #3b82f6, 12px 12px 0px 0px #000000",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neo-glow": "neo-glow 2s ease-in-out infinite",
      },
      fontFamily: {
        black: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neo: "8px 8px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "12px 12px 0px 0px rgba(0,0,0,1)",
        "neo-xl": "16px 16px 0px 0px rgba(0,0,0,1)",
        "neo-blue": "8px 8px 0px 0px #3b82f6",
        "neo-blue-lg": "12px 12px 0px 0px #3b82f6",
        "neo-glow": "0 0 20px #3b82f6, 0 0 40px #3b82f6, 8px 8px 0px 0px #000000",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
