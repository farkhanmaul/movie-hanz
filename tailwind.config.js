/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          black: '#0f0f0f',
          gray: '#181818',
        }
      },
      fontFamily: {
        'netflix': ['Netflix Sans', 'Roboto', 'Open Sans', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}