/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'court-orange': '#f15a24',
        'deep-navy': '#0a1628',
        'gold': '#f4c95d',
      }
    },
  },
  plugins: [],
}
