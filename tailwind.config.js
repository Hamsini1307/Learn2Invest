/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', '"Outfit"', 'sans-serif'],
        sans: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
