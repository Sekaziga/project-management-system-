/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './inertia/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          1: 'var(--gray-1)',
          2: 'var(--gray-2)',
          3: 'var(--gray-3)',
          4: 'var(--gray-4)',
          6: 'var(--gray-6)',
          7: 'var(--gray-7)',
          8: 'var(--gray-8)',
          10: 'var(--gray-10)',
          12: 'var(--gray-12)',
        },
      },
    },
  },
  plugins: [],
}
