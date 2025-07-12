/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      keyframes: {
        highlight: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        highlight: 'highlight 0.8s ease-out forwards',
      },
      colors: {
        forest: '#517352',
        highlight: '#afdeb0'
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};

export default config;