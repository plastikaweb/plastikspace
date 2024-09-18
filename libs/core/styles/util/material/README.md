# core-styles-util-material

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

## Running unit tests

Run `nx test core-styles-util-material` to execute the unit tests.
