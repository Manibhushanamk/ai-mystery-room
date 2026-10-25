/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#080b11',
        surface: {
          DEFAULT: '#0f141f',
          elevated: '#161e2e',
          accent: '#1e283d',
        },
        border: {
          subtle: '#1e293b',
          highlight: '#334155',
        },
        detective: {
          gold: '#d97706',
          amber: '#f59e0b',
          crimson: '#ef4444',
          emerald: '#10b981',
          cyan: '#06b6d4',
          slate: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
