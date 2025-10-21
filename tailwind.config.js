/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          primary: '#000000',
          secondary: '#1A1A1A',
          tertiary: '#2D2D2D',
        },
        beige: {
          primary: '#F5F5DC',
          secondary: '#EAE7D6',
          accent: '#D4C5A0',
          dark: '#B8A889',
        },
        warm: {
          beige: '#FAF8F3',
          gray: '#4A4A4A',
        },
        primary: {
          50: '#FAF8F3',
          100: '#F5F5DC',
          200: '#EAE7D6',
          300: '#DFD9C0',
          400: '#D4C5A0',
          500: '#B8A889',
          600: '#9C8B6F',
          700: '#806F56',
          800: '#64533D',
          900: '#483724',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
