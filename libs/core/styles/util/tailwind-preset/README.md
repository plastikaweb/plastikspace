# @plastik/core/styles/util/tailwind-preset

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-0F172A?style=for-the-badge&logo=tailwindcss)

- [@plastik/core/styles/util/tailwind-preset](#plastikcorestylesutiltailwind-preset)
  - [Description](#description)
  - [Usage](#usage)
  - [Resources](#resources)

## Description

A **Shared Tailwind CSS Preset** to ensure consistent design tokens (colors, spacing, breakpoints) across all applications and libraries in the workspace.

## Usage

Import the preset in your `tailwind.config.js` and add it to the `presets` array:

```javascript
const sharedTailwindConfig = require('../../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    // ... paths to your components
  ],
};
```

## Resources

- [Set up Tailwind CSS with Angular in an Nx workspace](https://leosvel.dev/blog/set-up-tailwind-css-with-angular-in-an-nx-workspace)
