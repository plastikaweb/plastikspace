# core-util-assets

- [core-util-assets](#core-util-assets)
  - [Description](#description)
  - [How to use](#how-to-use)
    - [Images and icons](#images-and-icons)
    - [Font families](#font-families)

## Description

A collection of global repository assets, mainly fonts, icons and images that are available across all applications.

## How to use

### Images and icons

Add assets to the `project.json` file for a concrete application, under the assets definition that needs to use them and set an output route.

```json
{
  "glob": "**/*",
  "input": "libs/core/assets",
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
    "includePaths": ["libs/core/assets/src/lib/fonts"]
 },
}
```

You can reference a font definitions file in your code pointing to the output definition:

```scss
// The target directory will be 'libs/core/assets/src/lib/fonts/circular-std/circular-std.scss'.
@use 'circular-std/circular-std.scss';
````
