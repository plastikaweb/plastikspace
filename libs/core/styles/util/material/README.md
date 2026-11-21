# @plastik/core/styles/util/material

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/styles/util/material](#plastikcorestylesutilmaterial)
  - [Description](#description)
  - [Usage](#usage)
    - [Setup](#setup)
    - [Mixins \& Utilities](#mixins--utilities)
      - [Form Field Mixin (opt-in)](#form-field-mixin-opt-in)
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

Loading `core_input_material` writes three small corrections (the search decoration of WebKit, the notch of the outline, the checkbox field type)
and the utility classes `rounded-input--sm`, `--md` and `--lg`.
**It does not restyle the form fields of the application.** A look is something an application asks for, with one of the mixins below.

#### Form Field Mixin (opt-in)

Sets the measures of every `mat-form-field` under the selector it is included in, through `mat.form-field-overrides`, and sizes the password toggle
of `plastik-input-password-with-visibility-type` to a 44px target with an 18px icon.

**Signature:**

`material-form-field($height: 48px, $vertical-padding: 12px, $radius: 12px, $text-size: 0.9rem, $label-size: 0.917rem, $label-weight: 500, $leading-icon-color: null)`

Every argument takes a CSS variable as well as a literal. `$leading-icon-color` left out keeps Material's colour.

**Example:**

```scss
@use 'core_input_material' as input;

// At the root of a global stylesheet: every field of the application.
@include input.material-form-field($height: var(--mat-field-height, 48px));

// Or under a class: only the fields inside it.
.compact-form {
  @include input.material-form-field($height: 40px, $vertical-padding: 8px);
}
```

The eco family asks for it once, in `libs/eco/styles/src/_eco_form_field.scss`, which eco-store and eco-admin load. No other application is touched.

#### Rounded Input Mixin

Normalizes `mat-form-field` with a compact, rounded appearance.

**Signature:**

`material-input-rounded($height: 40px, $radius: 22px, $border-width: 2px, $padding-inline: 0, $hide-floating-label: false)`

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
