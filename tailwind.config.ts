import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff88',
        secondary: '#00ccff',
        accent: '#ff0055',
        warning: '#ff9500',
        dark: {
          bg: '#0a0e27',
          bgSecondary: '#1a1f3a',
          bgTertiary: '#0d1b2a',
        }
      },
      fontFamily: {
        'space': ['Space Grotesk', 'monospace'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'alert-pulse': 'alert-pulse 1.2s ease-in-out infinite',
        'warn-pulse': 'warn-pulse 2.5s ease-in-out infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88' },
          '50%': { textShadow: '0 0 25px #00ff88, 0 0 45px #00ff88' },
        },
        'alert-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,0,85,.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,0,85,.8)' },
        },
        'warn-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255,149,0,.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255,149,0,.8)' },
        },
        'scanline': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
