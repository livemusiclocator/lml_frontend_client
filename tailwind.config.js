/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Montserrat"', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'spinner-grow': 'spinner-grow 1s linear infinite'
      }
    }
  },
  plugins: [],
}

