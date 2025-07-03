# CS Styling

- [CS Styling](#cs-styling)
  - [Description](#description)
  - [TailwindCSS configuration](#tailwindcss-configuration)
  - [Material configuration](#material-configuration)
  - [Customize Angular Material Components: CSS custom properties](#customize-angular-material-components-css-custom-properties)
    - [Bad practices to avoid](#bad-practices-to-avoid)
  - [Useful Links](#useful-links)

## Description

We follow the [Angular Component styles](https://angular.io/guide/component-styles) practices.

This repo uses:

- [Angular Material](https://material.angular.io/) components to have a base styling and functionality.
- [tailwindCSS](https://tailwindcss.com/) as the base framework to style components.
- [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to customize some properties by theme or application.

## TailwindCSS configuration

For any project that you want to use tailwindcss:

- A base [tailwind.config.js](../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config.js) file already exists as a core util lib.
- Each application should provide the CSS variables that exists in that app in its app `apps/my-app/src/styles/_theme.scss` file.
- Each application should [inject the shared styles](../libs/core/styles/util/tailwind-preset/README.md).
- Each application should [inject the global material adjustments styles](../libs/core/styles/util/material/README.md).

A simple app example could be like this:

```css
/* apps/my-app/src/styles/_theme_.scss */

:root {
  /* Colors */
  // To have a consistent color palette, use the same color names and variants for the same colors defined for material in `_palette.scss`.
  --primary-100: #b6cbdf;
  --primary-500: #0b5394;
  --primary-700: #084281;
  --accent-100: #fef6ed;
  --accent-600: #f5ab63;
  --accent-800: #f2994e;

  --primary: var(--primary-500);
  --primary-light: var(--primary-100);
  --primary-dark: var(--primary-700);
  --secondary-light: var(--accent-100);
  --secondary: var(--accent-600);
  --secondary-dark: var(--accent-800);

  /* State colors */
  --plastik-error-notification-box-color: var(--secondary-dark);
  --plastik-info-notification-box-color: var(--primary-light);
  --plastik-warning-notification-box-color: var(--secondary-light);
  --plastik-success-notification-box-colors: var(--primary)

  /* Spacing */
  --spacing-tiny: 0.25rem;
  --spacing-sub: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-xxl: 6rem;

  /* Font Size */
  --font-size-tiny: 0.7rem;
  --font-size-sm: 0.85rem;
  --font-size-base: 1rem;
  --font-size-md: 1.4rem;
  --font-size-lg: 1.8rem;
  --font-size-xl: 2.2rem;
  --font-size-xxl: 2.6rem;
}
```

Import it in the main styles.scss app file.

```css
/* apps/my-app/src/styles/styles.scss */

/* Main app theme variables */
@use 'theme';
/* Material global CSS adjustments */
@use 'core_styles_util_material';
/* Add any other specific scss files */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-size: 14px;
    @apply box-border;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    @apply text-gray-80 font-light font-poppins;
  }

 /* add any other base styles related to this app */
}
```

After that you can use tailwind normally both on global style files and component-based style sheets.

> tailwindcss classes take preference over other libraries.

If you are repeating styling (applying the same list of tailwindCSS classes to an element more than once) be [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

- Maybe that is a symptom that you have to refactor a specific angular component and break it into small pieces.
- As a final solution extract it to a custom class using @apply to use tailwindCSS classes. To name these classes use [BEM](https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/).

```css
.header__logo {
  @apply flex justify-center items-center p-sm;
}
```

## Material configuration

The project uses Angular Material v20 which brings several improvements and changes:

- Enhanced Theming system with better CSS custom properties support
- Improved accessibility features
- Better component styling customization options

To use Material in a project:

### 1. Create an m3 theme

```bash
yarn nx generate @angular/material:m3Theme
```

> Follow the prompts to select your primary color palette. Select at least the primary color, use CSS instead of SCSS and select the route of the theme file (e.g. `apps/my-app/src/styles/themes/my-apptheme.css`).

### 2. Configure your application theme while creating a `_theme.scss` file in your app's styles directory and use the Material Theming system variables to define your tailwindcss variables

```scss
   --primary: var(--mat-sys-primary);
   --primary-light: var(--mat-sys-primary-container);
   --primary-lighter: var(--mat-sys-primary-fixed);
   --primary-dark: var(--mat-sys-on-primary);
   --primary-darker: var(--mat-sys-on-primary-container);
   --secondary: var(--mat-sys-secondary);
   --secondary-light: var(--mat-sys-secondary-container);
   --secondary-lighter: var(--mat-sys-secondary-fixed);
   --secondary-dark: var(--mat-sys-on-secondary);
   --secondary-darker: var(--mat-sys-on-secondary-container);

   --warn: var(--mat-sys-error);
   --warn-70: var(--mat-sys-error-container);
   --warn-90: var(--mat-sys-on-error-container);
   --warn-25: var(--mat-sys-on-error);
   --warn-10: var(--mat-sys-error-container);
   --white: #ffffff;
   --black: #000000;

```

### 3. Apply the theme in your `styles.scss`

> [Angular Material Theming](https://material.angular.io/guide/theming)

```scss
   @use '@angular/material' as mat;
   @use 'themes/my-theme';
   @use 'theme';
   @use 'core_styles_util_material';

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    html {
    // ... all the base styles
    }
  }

  @layer components {
    // ... all the components styles
    // for example:
    @include mat.button-overrides(
    (
      filled-focus-state-layer-opacity: 0.2,
    )
  );
  }

  @layer utilities {
    // ... all the utilities styles if any
  }
```

## Customize Angular Material Components: CSS custom properties

To customize some Angular Material component properties we can use different approaches:

- Component Tokens

> [Component tokens](https://material.angular.io/guide/theming#component-tokens) are a new way to style Material components.

```css
/* apps/my-app/src/styles/styles.scss */

@include mat.form-field-overrides(
    (
      filled-disabled-label-text-color: var(--mat-sys-outline),
      filled-disabled-input-text-color: var(--mat-sys-outline),
    )
  );
```

- CSS custom properties.
Some component libraries that uses Material components are ready to style some of their properties using global CSS variables that overwrite existing material components variables.

```css
/* apps/my-app/src/styles/_theme.scss */

:root {
  /* more variable definitions... */

  /* Custom Material for Progress Bar Material Component */
  --plastik-mdc-linear-progress-track-color: rgb(var(--secondary-light));
}
```

> These variables must be defined in the main _theme.scss and used in the library component css if only affects this library or in the `core-styles-util-material` libraries if affects more than one library.

```css
/* libs/shared/activity/ui/src/lib/shared-activity-ui-linear/shared-activity-ui-linear.component.ts */

.mat-mdc-progress-bar {
  /*
  --mdc-linear-progress-track-color material custom property is overwritten by our --plastik-mdc-linear-progress-track-color variable.
  */

  --mdc-linear-progress-track-color:
    var(--plastik-mdc-linear-progress-track-color,
    /* remember to provide a fallback */
    rgb(183, 183, 183)
  ) !important;
}
```

```css
/* libs/shared/form/feature/src/lib/shared-form-feature.component.ts */

 :host ::ng-deep .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid) .mdc-floating-label {
        color: var(--plastik-mdc-floating-label-color, #000000);
      }
```

For a list of available properties to be customized, take a look at the documentation for each UI library or add yours... and document it.

- CSS overwrite of Angular Material styles
You can also overwrite Material styles if for some reason the previous approach doesn't work.
Try to overwrite them by using [CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) and avoid `!important` flag.

```css
/* core/styles/util/material/src/_paginator.scss */

.mat-mdc-paginator .mat-mdc-paginator-range-label {
  @apply mx-sub text-sm;
}
```

### Bad practices to avoid

> **Do not break components CSS encapsulation!**

Don't use deprecated `/deep/` pseudo-class to avoid unexpected behaviors while overwritten global styles from a component.

> Applying the ::ng-deep pseudo-class to any CSS rule completely disables view-encapsulation for that rule. Any style with ::ng-deep applied becomes a global style.
>
> In order to scope the specified style to the current component and all its descendants, be sure to include the :host selector before ::ng-deep.
>
> If the ::ng-deep combinator is used without the :host pseudo-class selector, the style can bleed into other components.
>
> Visit [(deprecated) /deep/, >>>, and ::ng-deep](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep) for more details.

## Useful Links

- [Angular Material Theming](https://material.angular.io/guide/theming)
- [Angular Material System variables](https://material.angular.io/guide/system-variables)
- [Angular Component styles](https://angular.dev/guide/components/styling)
- [tailwindcss](https://tailwindcss.com/)
- [How to use tailwindcss in Angular](https://www.angularjswiki.com/angular/angular-tailwind-css/)
- [tailwindcss Tutorial by the Net Ninja (videos)](https://www.youtube.com/watch?v=bxmDnn7lrnk&list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw)
- [Angular Material and tailwindcss (video)](https://www.youtube.com/watch?v=sugHzagGLU4)
- [tailwindcss configuration](https://tailwindcss.com/docs/configuration)
- [tailwindcss JIT mode](https://tailwindcss.com/docs/just-in-time-mode)
- [tailwindcss preflight](https://tailwindcss.com/docs/preflight)
- [Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Variable Secrets | Lea Verou | CSS Day 2022](https://www.youtube.com/watch?v=ZuZizqDF4q8&list=PLjnstNlepBvNqk-CeIgptyQFhZY0s5Ubp&index=21)
- [BEM: CSS Naming Conventions that Will Save You Hours of Debugging](https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/)
- [Material design palette generator](http://mcg.mbitson.com/)
