import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jua", "system-ui", "sans-serif"],
        gaegu: ["Gaegu", "cursive"],
      },
      colors: {
        palmon: {
          primary: "#7B4EE8",
          secondary: "#F6C453",
          accent: "#FF7BAC",
          mint: "#7DD3C0",
        },
      },
      backgroundImage: {
        "gradient-palmon": "linear-gradient(135deg, #7B4EE8 0%, #FF7BAC 100%)",
        "gradient-gold": "linear-gradient(135deg, #F6C453 0%, #FF8A5B 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(123, 78, 232, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
