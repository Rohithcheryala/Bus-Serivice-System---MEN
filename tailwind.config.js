const colors = require('tailwindcss/colors');
module.exports = {
  purge: {
    mode: 'layers',
    content: ['./public/**/*.html'],
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {},
    },
  },
  variants: {
    extend: {
      display: ['responsive', 'group-hover', 'group-focus'],
      backgroundColor: ['group-focus'],
      borderColor: ['group-focus'],
      borderWidth: ['hover', 'focus'],
      transform: ['hover', 'focus'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
