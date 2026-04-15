/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 셀마홈 프리미엄 컬러 팔레트
        'premium': {
          dark: '#0A0E27',
          'dark-secondary': '#1A1F3A',
          gold: '#D4AF37',
          'gold-light': '#E5C158',
          'gold-dark': '#B89A2F',
        },
        'navy': {
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5',
          600: '#3949AB',
          700: '#303F9F',
          800: '#283593',
          900: '#1A237E',
          dark: '#0A0E27',
        },
      },
      fontFamily: {
        // 한글 폰트
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        display: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(212, 175, 55, 0.15)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
}
