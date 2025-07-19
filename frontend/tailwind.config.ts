import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        primary:"#161817",
        secondary:"#1d1f1e",
        input: "#2e302f",
        border: "#343635",
        green: "#00FF00",

        button:"",
        "button-active": "#103729",

        message: "#134d37",
        "message-secondary":"#232524",

        text:"#333333",
        "dark":"#E0E0E0",
        "foregrund":"#595145",
        "muted":"#746868",
        "plain":"#9ea2a8",
        "important":"#ffeadf"
      },
      keyframes: {
        fadeIn: {
           '0%': { opacity: "0", transform: 'translateY(8px)' },
          '100%': { opacity: "1", transform: 'translateY(0)' },
        }
      },
       animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

export default config 