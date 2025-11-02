
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        panel: '#14001a',
        line: '#b26d35',
        switchOn: '#562701',
        cursor_line: '#7c471d',
        screen: '#14001a',
        header: '#261b2f'
      },
      textColor: {
        line: '#b26d35',
        ticker_indicators: 'rgba(197, 203, 206, 0.5)'
      },
      borderColor: {
        switchOn: '#482b02',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'Roboto', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        antonio: ['Antonio', 'sans-serif'],
        squada: ['Squada One', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif']
      },
    },
  },
  plugins: [],
}
