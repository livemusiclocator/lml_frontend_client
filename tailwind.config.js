/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lmlpink: "rgb(235,0,139)",
        customBlue: "#1DA1F2",
      },
      fontFamily: {
        sans: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "spinner-grow": "spinner-grow 1s linear infinite",
        "delayed-entrance": "delayed-entrance 0.5s linear",
      },
    },
  },
  plugins: [typography],
};
