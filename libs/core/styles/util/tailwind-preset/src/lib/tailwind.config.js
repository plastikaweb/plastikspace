module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
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
    },
    spacing: {
      sm: 'var(--spacing-sm)',
      md: 'var(--spacing-md)',
      lg: 'var(--spacing-lg)',
      xl: 'var(--spacing-xl)',
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
  },
  plugins: [],
};
