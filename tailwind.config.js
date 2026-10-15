/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skyBlue: {
          light: '#67C9FF',
          DEFAULT: '#249BEE',
          deep: '#1572C4'
        },
        grassGreen: {
          light: '#7FE064',
          DEFAULT: '#66C94D',
          dark: '#4BAA34',
          forest: '#247A3B'
        },
        sunlight: {
          light: '#FFF5D0',
          DEFAULT: '#FFE8A3',
          warm: '#F7D070'
        },
        playground: {
          dark: '#17352A',
          wood: '#A36538',
          woodDark: '#75431E',
          gold: '#FFD700',
          coinBorder: '#C68E17'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'play-sm': '0 4px 0 rgba(23, 53, 42, 0.15)',
        'play-md': '0 8px 0 rgba(23, 53, 42, 0.18)',
        'play-lg': '0 12px 0 rgba(23, 53, 42, 0.22)',
        'play-gold': '0 8px 0 #B87A08, 0 16px 30px rgba(255, 215, 0, 0.35)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
