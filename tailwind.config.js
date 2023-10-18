/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%": {
            transform: "rotate(-6deg)",
          },
          "25%": {
            transform: "rotate(6deg)",
          },
          "50%": {
            transform: "rotate(-6deg)",
          },
          "75%": {
            transform: "rotate(6deg)",
          },
          "100%": {
            transform: "rotate(-6deg)",
          },
        },
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
      },
      height: {
        100: "480px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "night", "coffee", "lofi"],
  },
};
