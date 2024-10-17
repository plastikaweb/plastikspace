/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config.js')],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        strippedlight:
          'repeating-linear-gradient(-45deg, var(--white) 0px, var(--white) 20px,var(--primary-light) 20px, var(--primary-light) 40px)',
        strippedSecondaryDark:
          'repeating-linear-gradient(-45deg, var(--secondary-dark) 0px, var(--secondary-dark) 20px,var(--secondary-darker) 20px, var(--secondary-darker) 40px)',
        strippedPrimaryDark:
          'linear-gradient(-90deg, var(--primary-dark) 0px, var(--primary-darker) 140px)',
      },
    },
  },
};
