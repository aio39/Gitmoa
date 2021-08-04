module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
        60: 60,
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      width: ['group-hover'],
      height: ['group-hover'],
    },
  },
  plugins: [],
}
