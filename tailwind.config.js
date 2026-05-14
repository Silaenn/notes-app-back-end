/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win-bg': '#008080', // Classic Teal
        'win-silver': '#c0c0c0',
        'win-grey': '#808080',
        'win-navy': '#000080',
        'win-blue': '#0000ff',
        'win-accent': '#ff00ff', // Magenta accent
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
