import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f9a538",
        secondary: "#f5893c",
        tertiary: "#f0613d",
      },
      keyframes: {
        "border-spin": {
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
        fadeOutDown: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "99%": { opacity: "1", transform: "translateY(100%)" },
          "100%": {
            opacity: "0",
            transform: "translateY(100%)",
            display: "none",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(50%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "border-spin": "border-spin 7s linear infinite",
        "fade-out": "fadeOutDown 4s forwards",
        "fade-in": "fadeIn 1s forwards",
        "fade-in-up": "fadeInUp 1s forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
    }),
  ],
};
export default config;
