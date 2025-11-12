# core-styles-util-material

- [core-styles-util-material](#core-styles-util-material)
  - [Description](#description)
  - [How to use](#how-to-use)
    - [Input](#input)
      - [Mixins](#mixins)
        - [Input rounded](#input-rounded)
          - [Example applying a pre-defined utility class](#example-applying-a-pre-defined-utility-class)
          - [Example applying the `material-input-rounded` mixin with custom values](#example-applying-the-material-input-rounded-mixin-with-custom-values)
  - [Running unit tests](#running-unit-tests)

## Description

A collection of global CSS styles adjustments for Angular Material components.

## How to use

- Add the path `"libs/core/styles/util/material/src"` to the entry point of the styles in your app project.json.

```json
{
  "targets": {
    "build": {
      // other configuration properties...

      // main app styles CSS entry point
      "styles": ["apps/my-app/src/styles/styles.scss"],

      // Sass base path for imports: see https://angular.io/guide/workspace-config#style-preprocessor-options
      "stylePreprocessorOptions": {
        "includePaths": ["libs/core/styles/util/material/src"]
      }
    }
  }
}
```

- Import the base scss file in your app /styles/styles.scss file.

```css
/* apps/my-app/src/styles/styles.scss */

@use 'core_styles_util_material';
```

> [!NOTE]
> You can import the specific styles for a material component using the following syntax:
>
> ```css
> @use 'core_input_material';
> ```

### Input

#### Mixins

##### Input rounded

Use this mixin to normalize any Material `mat-form-field` with a compact, rounded appearance. It accepts four parameters:

- `height` (default `40px`): total height of the filled container.
- `radius` (default `22px`): corner radius applied to the filled container.
- `padding-inline` (default token `core_styles_util_material.$material-rounded-input-padding-md`): horizontal padding for the infix area.
- `hide-floating-label` (default `true`): hides the floating label when you do not want it rendered.

###### Example applying a pre-defined utility class

```css
/* apps/my-app/src/styles/styles.scss */

@use 'core_input_material';
```

```html
<!-- apps/my-app/src/app/example.component.html -->

<div class="rounded-input--md">
  <mat-form-field appearance="fill">
    <mat-label>Search</mat-label>
    <input matInput type="search" placeholder="Find items" />
    <button mat-icon-button matSuffix aria-label="Clear">
      <mat-icon>close</mat-icon>
    </button>
  </mat-form-field>
</div>
```

###### Example applying the `material-input-rounded` mixin with custom values

```css
/* apps/my-app/src/styles/styles.scss */

@use 'core_input_material';

// Put this in your styles.scss file or in a specific component scss file
.search-input {
  @include core_input_material.material-input-rounded(40px, 22px);
}
```

```html
<!-- apps/my-app/src/app/example.component.html -->

<div class="search-input">
  <mat-form-field appearance="fill">
    <mat-label>Search</mat-label>
    <input matInput type="search" placeholder="Find items" />
    <button mat-icon-button matSuffix aria-label="Clear">
      <mat-icon>close</mat-icon>
    </button>
  </mat-form-field>
</div>
```

> [!NOTE]
> You can also use it with formly form fields by adding any predefined or custom utility class to the `fieldGroupClassName` property or any input `className` property.
>
> ```typescript
> // formly field config with rounded input
> {
>   fieldGroupClassName: 'rounded-input--md',
>   fieldGroup: [
>     {
>       key: 'query',
>       type: 'input',
>       props: {
>         type: 'search',
>         label: 'Search',
>         placeholder: 'Search',
>         required: false,
>         attributes: {
>           autocomplete: 'off',
>         },
>       },
>     },
>   ],
> }
> ```

## Running unit tests

Run `nx test core-styles-util-material` to execute the unit tests.
