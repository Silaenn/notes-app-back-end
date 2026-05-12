/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'y2k-purple': 'oklch(70% 0.25 320)',
        'y2k-cyan': 'oklch(80% 0.2 190)',
        'y2k-pink': 'oklch(75% 0.3 350)',
        'y2k-bg': 'oklch(15% 0.05 280)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
