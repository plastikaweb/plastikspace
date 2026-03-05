# CS Styling

- [CS Styling](#cs-styling)
  - [Description](#description)
  - [TailwindCSS configuration](#tailwindcss-configuration)
    - [Option A: Tailwind CSS v4 (Modern Apps - e.g. eco-store)](#option-a-tailwind-css-v4-modern-apps---eg-eco-store)
    - [Option B: Tailwind CSS v3 (Legacy Apps)](#option-b-tailwind-css-v3-legacy-apps)
    - [General Tailwind Best Practices](#general-tailwind-best-practices)
  - [Material configuration](#material-configuration)
    - [1. Create an m3 theme](#1-create-an-m3-theme)
    - [2. Configure your application theme variables](#2-configure-your-application-theme-variables)
    - [3. Apply the theme in your `styles.scss`](#3-apply-the-theme-in-your-stylesscss)
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

Since the monorepo contains multiple applications, there are currently two ways Tailwind CSS is configured, depending on the version used by the specific app.

### Option A: Tailwind CSS v4 (Modern Apps - e.g. eco-store)

Newer applications use **Tailwind CSS v4** which relies entirely on CSS variables and native `@import` statements without a `tailwind.config.js`.

- A base [Tailwind CSS theme file](../libs/core/styles/util/tailwind4/src/_core_tailwind_theme.css) already exists as a core util lib. This file maps Tailwind's core variables to our custom properties.
Please refer to its [documentation](../libs/core/styles/util/tailwind4/README.md) for IDE intellisense instructions.

- Each application must provide its own CSS variable definitions in a theme file (e.g., `apps/my-app/src/styles/my-app-theme.css`).

A simple app theme example looks like this:

```css
/* apps/my-app/src/styles/my-app-theme.css */

:root {
  /* Define the full 50-950 scale for each palette (Primary, Secondary, Tertiary, Error, etc.) */
  --primary-50: #eef3ec;
  --primary-100: #dfe8dc;
  /* ... */
  --primary-500: #356a1f;
  /* ... */
  --primary-950: #000200;

  /* State colors and basic values */
  --transparent: transparent;
  --black: #000000;
  --white: #ffffff;
}

html {
  /* Define mode-aware variables using light-dark() */
  color-scheme: light;
  --mat-sys-primary: light-dark(#356a1f, #9ad67d);

  /* Organic spacing */
  --space-xs: 0.25rem;
  --space-md: 1rem;
}
```

Import it in the main styles file, along with the core tailwind setup:

```scss
/* apps/my-app/src/styles/styles.scss */

@use 'tailwindcss';
/* Import the core Tailwind theme map */
@use 'core_tailwind_theme';
/* Import your app's custom theme variables */
@use 'my-app-theme';

@use 'base';
@use 'components';
@use 'utilities';
```

### Option B: Tailwind CSS v3 (Legacy Apps)

Older applications still use **Tailwind CSS v3** which relies on the `tailwind.config.js` and PostCSS setup.

- A base [tailwind.config.js](../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config.js) file already exists as a core util lib.
- Each application should [inject the shared styles](../libs/core/styles/util/tailwind-preset/README.md).
- Each application should define its theme using SCSS maps or standard CSS variables in `apps/my-app/src/styles/_theme.scss`.

```css
/* apps/my-app/src/styles/_theme_.scss */
:root {
  --primary-500: #0b5394;
  --primary: var(--primary-500);
}
```

Import it in the main styles.scss app file:

```text
/* apps/my-app/src/styles/styles.scss */

/* Main app theme variables */
@use 'theme';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### General Tailwind Best Practices

Regardless of the version used, after configuration, you can use standard tailwind classes (`bg-primary-500`, `text-secondary`, `p-md`) normally both on global style files and component-based style sheets.

> tailwindcss classes take preference over other libraries.

If you are repeating styling (applying the same list of tailwindCSS classes to an element more than once) be [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

- Maybe that is a symptom that you have to refactor a specific angular component and break it into small pieces.
- As a final solution, extract it to a custom class using `@apply` to combine tailwindCSS classes. To name these classes use [BEM](https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/).

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

### 2. Configure your application theme variables

Create a `_theme.scss` or `_theme.css` file in your app's styles directory and use the Material Theming system variables to define your tailwindcss or custom application colors.

```scss
   --primary: var(--mat-sys-primary);
   --primary-dark: var(--mat-sys-on-primary);
   --secondary: var(--mat-sys-secondary);
   /* ... */
   --warn: var(--mat-sys-error);
```

### 3. Apply the theme in your `styles.scss`

> [Angular Material Theming](https://material.angular.io/guide/theming)

```scss
/* apps/my-app/src/styles/styles.scss */

@use '@angular/material' as mat;
/* Import core specific material configurations */
@use 'core_input_material';
@use 'core_button_material';

/* For v4 Tailwind */
@use 'tailwindcss';

/* For base SCSS structures */
@use 'base';
@use 'components';
@use 'utilities';
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
