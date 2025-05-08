/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config.js')],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
