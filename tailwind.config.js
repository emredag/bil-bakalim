/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0f172a',
          secondary: '#1e293b',
          tertiary: '#334155',
        },
        accent: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          gold: '#fbbf24',
        },
        status: {
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          tertiary: '#94a3b8',
        },
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(251, 191, 36, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
      },
      dropShadow: {
        'glow': '0 0 8px rgba(59, 130, 246, 0.5)',
      },
      zIndex: {
        'tooltip': '10',
        'modal': '20',
        'confetti': '30',
        'toast': '40',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.safe-container': {
          padding: '1rem', // 16px - mobile
          '@screen md': {
            padding: '1.5rem', // 24px
          },
          '@screen lg': {
            padding: '2rem', // 32px
          },
          '@screen xl': {
            padding: '3rem', // 48px
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
