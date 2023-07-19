/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => (!!opacityValue ? `rgba(var(${variableName}), ${opacityValue})` : `rgb(var(${variableName}))`);
}

module.exports = {
  content: ['./apps/**/!(*.stories|*.spec).{html,ts,json}', './libs/**/!(*.stories|*.spec).{html,ts,json}'],
  important: true,
  theme: {
    colors: {
      primary: {
        light: withOpacity('--primary-light'),
        DEFAULT: withOpacity('--primary'),
        dark: withOpacity('--primary-dark'),
      },
      secondary: {
        light: withOpacity('--secondary-light'),
        DEFAULT: withOpacity('--secondary'),
        dark: withOpacity('--secondary-dark'),
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
      error: 'var(--plastik-error-notification-box-color)',
      info: 'var(--plastik-info-notification-box-color)',
      warning: 'var(--plastik-warning-notification-box-color)',
      success: 'var(--plastik-success-notification-box-colors)',
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
      half: '50%',
      third: '33.33333%',
      quarter: '25%',
      full: '100%',
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
