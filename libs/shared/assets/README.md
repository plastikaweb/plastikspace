# shared-assets

## Description

A collection of shared assets, mainly fonts, icons and images that can be shared across repository applications.

## How to use

### Images and icons

Add assets to the `project.json` file for a concrete application, under the assets definition that needs to use them and set an output route.

```json
{
  "glob": "**/*",
  "input": "libs/shared/assets",
  "output": "/assets/"
},
```

You can reference an asset in your code pointing to the output definition:

```html
<svg-icon src="assets/svg/bars.svg"></svg-icon> <svg-icon src="assets/flags/jp.png"></svg-icon>
```

### Font families

Add the path of the base assets/fonts directory to the `project.json` file for each project `stylePreprocessorOptions` => `includePaths` array.

````json
{
  // ...More properties.
  "stylePreprocessorOptions": {
    "includePaths": ["libs/shared/assets/src/lib/fonts"]
 },
}
```

You can reference a font definitions file in your code pointing to the output definition:

```scss
// The target directory will be 'libs/shared/assets/src/lib/fonts/circular-std/circular-std.scss'.
@import 'circular-std/circular-std.scss';
````
