/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: '#E50914',
        hulu: '#1CE783',
        prime: '#00A8E1',
        hbo: '#7D3CFE',
        disney: '#0063E5',
        paramount: '#0064FF',
        showtime: '#C8102E',
        peacock: '#000000',
      },
    },
  },
  plugins: [],
}
