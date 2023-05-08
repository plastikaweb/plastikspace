# core-styles-util-tailwind-preset

- [core-styles-util-tailwind-preset](#core-styles-util-tailwind-preset)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Useful links](#useful-links)

## Description

A base tailwind CSS preset to import into apps and libraries tailwind configurations.

## How to use

Import the tailwind.config preset file and add it to the presets array in tailwind config files.

```javascript

...
const sharedTailwindConfig = require('../../libs/core/styles/util/tailwind-preset/src/lib/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    // ...
  ]
};

```

## Useful links

- [Set up Tailwind CSS with Angular in an Nx workspace](https://leosvel.dev/blog/set-up-tailwind-css-with-angular-in-an-nx-workspace)
