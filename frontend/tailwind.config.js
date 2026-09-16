/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        brand: {
          cyan:  '#0ea5e9',
          teal:  '#0d9488',
          dark:  '#0c1a2e',
          darker:'#070f1c',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0ea5e9, #0d9488)',
        'brand-gradient-dark': 'linear-gradient(135deg, #0c2a3a, #0a2420)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
