# @plastik/core/styles/util/tailwind4

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-0F172A?style=for-the-badge&logo=tailwindcss)

- [@plastik/core/styles/util/tailwind4](#plastikcorestylesutiltailwind4)
  - [Description](#description)
    - [vscode settings](#vscode-settings)
  - [Usage](#usage)
    - [Setup](#setup)
    - [Usage in components](#usage-in-components)

## Description

A collection of **global CSS variables** for `TailwindCSS v4`, enforcing a consistent look and feel across the workspace.

### vscode settings

In order to get intellisense for tailwind, we have this property in `.vscode/settings.json` file:

```json
{
  "tailwindCSS.experimental.configFile": "libs/core/styles/util/tailwind4/src/_core_tailwind_theme.css"
}
```

## Usage

### Setup

1. **Project Config**: Add the library path to `stylePreprocessorOptions` in `project.json`:

   ```json
   "stylePreprocessorOptions": {
     "includePaths": ["libs/core/styles/util/tailwind4/src"]
   }
   ```

2. **Global Import**: Import the base styles in your app's `styles.scss`:

   ```scss
   @use 'core_tailwind_theme';
   ```

### Usage in components

To use in components, import the library using the `@use` syntax:

```scss
@use 'core_tailwind_theme';
```
