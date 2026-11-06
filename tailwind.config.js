/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f6',
          100: '#ffe1ec',
          200: '#ffc2d8',
          300: '#ff9cbd',
          400: '#fb6f9e',
          500: '#ec4584',
          600: '#d02a68',
          700: '#ab1f54',
          800: '#8a1d49',
          900: '#731c41',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
