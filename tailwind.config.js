/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#0d0d12',
          surface:  '#13131c',
          elevated: '#1c1c28',
          border:   '#252538',
        },
        accent: {
          DEFAULT: '#e8a020',
          light:   '#f5c060',
          dim:     '#e8a02033',
        },
        tx: {
          primary: '#ece9e0',
          muted:   '#7a7590',
          faint:   '#3e3c52',
        },
      },
      fontFamily: {
        display: ['"Red Hat Display"', '"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Open Sans"', 'sans-serif'],
        mono:    ['"Ubuntu Mono"', '"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
