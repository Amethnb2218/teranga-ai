/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#f5e6d3',
          200: '#e8c9a0',
          300: '#d4a574',
          400: '#c4884e',
          500: '#a16b3a',
          600: '#7d5230',
          700: '#5c3d24',
          800: '#3d2918',
          900: '#261a10',
        },
        soil: {
          50: '#faf7f5',
          100: '#f0ebe6',
          200: '#e2d5c9',
          300: '#cdb8a5',
          400: '#b39578',
          500: '#9a7a5c',
          600: '#7d6248',
          700: '#5e4a37',
          800: '#3f3226',
          900: '#2a2119',
        },
        leaf: {
          50: '#f4f9f1',
          100: '#e4f0dc',
          200: '#c8e1b8',
          300: '#a3cc89',
          400: '#7db55e',
          500: '#5e9a3f',
          600: '#487a30',
          700: '#385e27',
          800: '#2e4b22',
          900: '#263f1e',
        },
        harvest: {
          50: '#fff9ed',
          100: '#fff1d4',
          200: '#ffdfa8',
          300: '#ffc971',
          400: '#ffaa38',
          500: '#ff9011',
          600: '#f07507',
          700: '#c75808',
          800: '#9e440f',
          900: '#7f3a10',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
