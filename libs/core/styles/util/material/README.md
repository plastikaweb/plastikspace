# @plastik/core/styles/util/material

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/styles/util/material](#plastikcorestylesutilmaterial)
  - [Description](#description)
  - [Usage](#usage)
    - [Setup](#setup)
    - [Mixins \& Utilities](#mixins--utilities)
      - [Rounded Input Mixin](#rounded-input-mixin)
  - [Running Unit Tests](#running-unit-tests)

## Description

A collection of **global CSS adjustments and mixins** for Angular Material components, enforcing a consistent look and feel (e.g., rounded inputs) across the workspace.

## Usage

### Setup

1. **Project Config**: Add the library path to `stylePreprocessorOptions` in `project.json`:

   ```json
   "stylePreprocessorOptions": {
     "includePaths": ["libs/core/styles/util/material/src"]
   }
   ```

2. **Global Import**: Import the base styles in your app's `styles.scss`:

   ```scss
   @use 'core_styles_util_material';
   ```

### Mixins & Utilities

You can import specific component styles using the `@use` syntax:

```scss
@use 'core_input_material';
```

#### Rounded Input Mixin

Normalizes `mat-form-field` with a compact, rounded appearance.

**Signature:**

`material-input-rounded($height: 40px, $radius: 22px, $padding-inline: ..., $hide-floating-label: true)`

**Example:**

```scss
.search-input {
  @use 'core_input_material';
  @include core_input_material.material-input-rounded(40px, 22px);
}
```

```html
<div class="search-input">
  <mat-form-field appearance="fill">
    <!-- ... -->
  </mat-form-field>
</div>
```

**Formly Integration:**

```typescript
{
  fieldGroupClassName: 'rounded-input--md', // pre-defined utility class
  fieldGroup: [ ... ]
}
```

## Running Unit Tests

Run `nx test core-styles-util-material` to execute the unit tests.
