/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config.js')],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        radar: {
          '0%': { top: '36px', left: '36px', width: 0, height: 0, opacity: 0 },
          '4.9%': { top: '36px', left: '36px', width: 0, height: 0, opacity: 0 },
          '5%': { top: '36px', left: '36px', width: 0, height: 0, opacity: 1 },
          '100%': { top: 0, left: 0, width: '72px', height: '72px', opacity: 0 },
        },
      },
      animation: {
        radar: 'radar 1s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
    },
  },
};
