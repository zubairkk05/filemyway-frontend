import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "#F4F3EF",
        surface: "#FFFFFF",
        ink: "#141414",
        muted: "#4A4A45",
        line: "#CFCFC8",
        orange: {
          DEFAULT: "#FF4B14",
          hover: "#FF6B3D",
          press: "#E63E08",
          text: "#B93408",
        },
        highlight: "#FFD84D",
        success: "#0F7B3F",
        error: "#B3261E",
        disabled: {
          bg: "#E4E3DD",
          text: "#6A6A64",
          border: "#B9B8B0",
        },
      },
      fontFamily: {
        sans: ["var(--font-atkinson)", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "var(--font-atkinson)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        card: "12px",
        box: "24px",
      },
      borderWidth: {
        3: "3px",
      },
      maxWidth: {
        container: "1120px",
        widget: "760px",
      },
      spacing: {
        18: "4.5rem",
      },
      fontSize: {
        body: ["20px", "1.5"],
        helper: ["18px", "1.5"],
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
