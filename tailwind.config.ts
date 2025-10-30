import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#2a2a2a',
        input: '#3a3a3a',
        border: '#4a4a4a',
        'green-light': '#25D366',
        'green-dark': '#128C7E',
        'button-hover': '#128C7E',
        'button-active': '#075E54',
        'message-sent': '#005C4B',
        'message-received': '#202C33',
        'text-primary': '#E4E6EB',
        'text-secondary': '#B0B3B8',
        'dark-900': '#121212',
          'dark-800': '#1e1e1e',
          'dark-700': '#2d2d2d',
          'dark-600': '#3a3a3a',
        foreground: '#E4E6EB',
        muted: '#B0B3B8',
        plain: '#FFFFFF',
        important: '#25D366',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
