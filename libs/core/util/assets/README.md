# @plastik/core/assets

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)

- [@plastik/core/assets](#plastikcoreassets)
  - [Description](#description)
  - [Usage](#usage)
    - [Images and Icons](#images-and-icons)
    - [Font Families](#font-families)

## Description

A collection of **global repository assets**, including fonts, icons, and images, available across all applications.

## Usage

### Images and Icons

Add assets to the `project.json` file for your application. Define the input path from this library and the output path in your app's dist folder:

```json
{
  "glob": "**/*",
  "input": "libs/core/assets",
  "output": "/assets/"
}
```

Reference the asset in your code or HTML:

```html
<!-- Example SVG Icon -->
<svg-icon src="assets/svg/bars.svg"></svg-icon>

<!-- Example Flag Image -->
<svg-icon src="assets/flags/jp.png"></svg-icon>
```

### Font Families

To use shared fonts, add the fonts directory to the `stylePreprocessorOptions` -> `includePaths` array in your `project.json`:

```json
{
  "stylePreprocessorOptions": {
    "includePaths": ["libs/core/assets/src/lib/fonts"]
  }
}
```

Reference a font definition file in your SCSS:

```scss
// Imports 'libs/core/assets/src/lib/fonts/circular-std/circular-std.scss'
@use 'circular-std/circular-std.scss';
```
