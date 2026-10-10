/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',
          card: 'rgba(17, 24, 39, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(30, 41, 59, 0.8)',
        },
        cyan: {
          glow: '#00F0FF',
          accent: '#00D2FF',
          dark: '#0082A6',
        },
        hazard: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#DC2626',
        },
        slate: {
          850: '#151E2E',
          950: '#070A12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'scan-line': 'scan 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px #00F0FF)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px #00F0FF)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      }
    },
  },
  plugins: [],
}
