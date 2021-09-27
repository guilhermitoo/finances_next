module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    height: {
      12: '3rem',
      24: '6rem',
      32: '8rem',
      10: '8%',
      90: '92%',
      full:	'100%',
      screen: '100vh',
     }
  },
  variants: {
    extend: {
      backgroundColor: ['even'],
    }
  },
  plugins: [],
}
