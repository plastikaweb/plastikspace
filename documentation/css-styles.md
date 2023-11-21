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

Add a custom palette colors to the `_palette.scss` file. You can use the [Material design palette generator](http://mcg.mbitson.com/) to generate a palette.

```css
/* apps/my-app/src/styles/_palette.scss */
$md-primary: (
  50: #e2eaf2,
  100: #b6cbdf,
  200: #85a9ca,
  300: #5487b4,
  400: #306da4,
  500: #0b5394,
  600: #0a4c8c,
  700: #084281,
  800: #063977,
  900: #032965,
  A100: #95b6ff,
  A200: #6294ff,
  A400: #2f71ff,
  A700: #155fff,
  contrast: (
    50: #000000,
    100: #000000,
    200: #000000,
    300: #ffffff,
    400: #ffffff,
    500: #ffffff,
    600: #ffffff,
    700: #ffffff,
    800: #ffffff,
    900: #ffffff,
    A100: #000000,
    A200: #000000,
    A400: #ffffff,
    A700: #ffffff,
  ),
);

$md-accent: (
  50: #fef6ed,
  100: #fce8d3,
  200: #fbd9b5,
  300: #f9c997,
  400: #f7be81,
  500: #f6b26b,
  600: #f5ab63,
  700: #f3a258,
  800: #f2994e,
  900: #ef8a3c,
  A100: #ffffff,
  A200: #ffffff,
  A400: #ffe7d5,
  A700: #ffd8bc,
  contrast: (
    50: #000000,
    100: #000000,
    200: #000000,
    300: #000000,
    400: #000000,
    500: #000000,
    600: #000000,
    700: #000000,
    800: #000000,
    900: #000000,
    A100: #000000,
    A200: #000000,
    A400: #000000,
    A700: #000000,
  ),
);

$md-warn: (
  50: #f9e0e0,
  100: #f0b3b3,
  200: #e68080,
  300: #db4d4d,
  400: #d42626,
  500: #cc0000,
  600: #c70000,
  700: #c00000,
  800: #b90000,
  900: #ad0000,
  A100: #ffd7d7,
  A200: #ffa4a4,
  A400: #ff7171,
  A700: #ff5858,
  contrast: (
    50: #000000,
    100: #000000,
    200: #000000,
    300: #ffffff,
    400: #ffffff,
    500: #ffffff,
    600: #ffffff,
    700: #ffffff,
    800: #ffffff,
    900: #ffffff,
    A100: #000000,
    A200: #000000,
    A400: #000000,
    A700: #000000,
  ),
);
```

Use it in your `_material.scss` file.

```css
/* apps/my-app/src/styles/_material.scss */
@use '@angular/material' as mat;
@use 'sass:map';
@use 'palette';
@use 'theme';

@include mat.core();

$theme: mat.define-light-theme(
  (
    color: (
      primary: mat.define-palette(palette.$md-primary, 500, 100, 700),
      accent: mat.define-palette(palette.$md-accent, A200, A100, A400),
      warn: mat.define-palette(palette.$md-warn),
    ),
    typography:
      mat.define-typography-config(
        $font-family: var(--sans-serif),
        $body-1: mat.define-typography-level(var(--font-size-base), var(--spacing-md), 400),
      ),
    density: -1,
  )
);

$merged-theme: map.deep-merge(
  $theme,
  (
    color: (
      background: (
        background: mat.get-color-from-palette(palette.$md-primary, 50),
      ),
      foreground: (
        text: mat.get-color-from-palette(palette.$md-primary, 900),
      ),
    ),
  )
);

@include mat.all-component-themes($merged-theme);
```

In order to get advantage of the Angular Material components we'll use:

- CSS variables attached to a UI library using material components.
- the `core_styles_util_material.scss` from the [core-styles-util-material](../libs/core/styles/util/material/README.md) library.

```css
/* apps/my-app/src/styles/styles.scss */

@use 'core_styles_util_material';
```

In this way we are loading the Angular Material styles entrypoint and some CSS configuration by component.

## Customize Angular Material Components: CSS custom properties

To customize some Angular Material component properties we can use different approaches:

- CSS custom global properties.  
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
You can also overwrite Material styles. Try to overwrite them by using [CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) and avoid `!important` flag.

```css
/* core/styles/util/material/src/_paginator.scss */

.mat-mdc-paginator .mat-mdc-paginator-range-label {
  @apply mx-sub text-sm;
}
```

- Material component CSS configuration

 <!-- TODO: add documentation about how to use component material CSS configuration -->

### Bad practices to avoid

> **Do not break components CSS encapsulation!**

Don't use deprecated `/deep/` pseudo-class to avoid unexpected behaviors while overwritten global styles from a component.

> "Applying the ::ng-deep pseudo-class to any CSS rule completely disables view-encapsulation for that rule. Any style with ::ng-deep applied becomes a global style.  ****
> In order to scope the specified style to the current component and all its descendants, be sure to include the :host selector before ::ng-deep.  
> If the ::ng-deep combinator is used without the :host pseudo-class selector, the style can bleed into other components."
>
> From [(deprecated) /deep/, >>>, and ::ng-deep](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep) for more details.

## Useful Links

- [Angular Component styles](https://angular.io/guide/component-styles)
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
