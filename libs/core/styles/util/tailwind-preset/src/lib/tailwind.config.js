/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/*.{html,ts,json}', './libs/**/*.{html,ts,json}'],
  important: true,
  theme: {
    colors: {
      primary: {
        light: 'var(--primary-light)',
        DEFAULT: 'var(--primary)',
        dark: 'var(--primary-dark)',
      },
      secondary: {
        light: 'var(--secondary-light)',
        DEFAULT: 'var(--secondary)',
        dark: 'var(--secondary-dark)',
      },
      gray: {
        5: '#f2f2f2',
        10: '#e6e6e6',
        20: '#c9c9c9',
        30: '#adadad',
        40: '#919191',
        50: '#757575',
        60: '#5c5c5c',
        70: '#454545',
        80: '#2e2e2e',
        90: '#171717',
      },
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
      error: 'var(--error)',
      info: 'var(--info)',
      warning: 'var(--warning)',
      success: 'var(--success)',
    },
    spacing: {
      0: 0,
      tiny: 'var(--spacing-tiny)',
      sub: 'var(--spacing-sub)',
      sm: 'var(--spacing-sm)',
      md: 'var(--spacing-md)',
      lg: 'var(--spacing-lg)',
      xl: 'var(--spacing-xl)',
      xxl: 'var(--spacing-xxl)',
    },
    flexBasis: {
      0: '0',
      1: '1rem',
      2: '2rem',
      3: '3rem',
      4: '4rem',
      5: '5rem',
    },
    fontSize: {
      sub: 'var(--font-size-sub)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      md: 'var(--font-size-md)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      xxl: 'var(--font-size-xxl)',
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },

  plugins: [
    require('tailwindcss/plugin')(({ addBase }) => {
      addBase({
        'input[type="search"]::-webkit-search-decoration': { display: 'none' },
        'input[type="search"]::-webkit-search-cancel-button': { display: 'none' },
        'input[type="search"]::-webkit-search-results-button': { display: 'none' },
        'input[type="search"]::-webkit-search-results-decoration': { display: 'none' },
      });
    }),
    require('@tailwindcss/line-clamp'),
  ],
};
