/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mulberry: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ed7896',
          500: '#e14d74',
          600: '#cd2d5a',
          700: '#ac2049',
          800: '#8f1d40',
          900: '#5B2333',
          950: '#3d0f1e',
        },
        earth: {
          50: '#fdf8ef',
          100: '#faefd9',
          200: '#f4ddb2',
          300: '#ecc581',
          400: '#e3a64e',
          500: '#db8f2c',
          600: '#c47422',
          700: '#a3591e',
          800: '#8B6914',
          900: '#6b3d15',
          950: '#3a1e09',
        },
        forest: {
          50: '#f0f9ec',
          100: '#ddf2d5',
          200: '#bde6af',
          300: '#94d47f',
          400: '#6ebd56',
          500: '#4A7C28',
          600: '#3d8028',
          700: '#2D5016',
          800: '#2a4d22',
          900: '#254220',
          950: '#10240d',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          dark: '#F5EDE3',
        },
        charcoal: {
          DEFAULT: '#1A1A2E',
          light: '#16213E',
          lighter: '#1F2937',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
