/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafbf8",
        accent: "#78de24",
        primaryText: "#141b0e",
        subtleText: "#6f9550",
      },
      fontFamily: {
        sans: ["'Public Sans'", "'Noto Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
