# eco-styles

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-0F172A?style=for-the-badge&logo=tailwindcss)

- [eco-styles](#eco-styles)
  - [Description](#description)
  - [What the file defines](#what-the-file-defines)
  - [Who can consume it](#who-can-consume-it)
  - [Usage](#usage)
  - [Changing a token](#changing-a-token)

## Description

The Material 3 token base of the eco platform, shared by `eco-store` and `eco-admin`.
It is one plain CSS file, `src/_eco_tokens.css`, with no TypeScript, no path alias and no targets.

The file was `apps/eco-store/src/styles/eco-store-theme.css` until AREF-09 moved it here.
While it lived inside an application, `eco-admin` could not use it without pointing its build at another app's folder.

## What the file defines

- **Tonal palettes** `50`–`950` for `primary`, `secondary`, `tertiary`, `neutral`, `error`, `success`, `warning` and `info`, plus `--black`, `--white` and `--transparent`.
- **Colour scheme switches**: `html` follows the system, `html.dark` and `html.light` force one mode.
- **Material 3 system tokens** (`--mat-sys-*`): colour roles written with `light-dark()`, typescale, elevation, shape and state layers.
- **High-contrast values** for the colour roles, inside `@media (prefers-contrast: more)`.
- **Spacing scale** `--space-tiny` … `--space-xxl`.
- **`@custom-variant dark`**, which makes Tailwind's `dark:` follow the `.dark` class.

The values are literal: nothing is computed at build time.
The Tailwind aliases for these variables (`bg-primary-container`, `text-on-surface`…) live in
[`core_tailwind_theme`](../../core/styles/util/tailwind4/README.md), not here.

## Who can consume it

The library is tagged `scope:eco`, `type:util`: it belongs to `eco-store` and `eco-admin` and to no other application.

**Nx does not enforce that.** The file reaches an app through `stylePreprocessorOptions.includePaths`, which is build configuration, not a TypeScript import,
so `@nx/enforce-module-boundaries` never sees it and the project graph gets no edge from it.
Two things hold the rule instead:

- Each consuming app declares `"implicitDependencies": ["eco-styles"]` in its `project.json`. Without it `nx affected` would not rebuild the app when a token changes.
- Review. An app outside the eco family that adds `libs/eco/styles/src` to its `includePaths` builds without a single warning.

## Usage

1. Add the path and the dependency to the app's `project.json`:

   ```json
   {
     "implicitDependencies": ["eco-styles"],
     "targets": {
       "build": {
         "options": {
           "stylePreprocessorOptions": {
             "includePaths": ["libs/core/styles/util/tailwind4/src", "libs/eco/styles/src"]
           }
         }
       }
     }
   }
   ```

2. Load it from the app's `styles.scss`, **after** `tailwindcss`:

   ```scss
   @use 'core_tailwind_theme';
   @use 'tailwindcss';
   @use 'eco_tokens';
   ```

   The order matters: the file ends in a `@custom-variant` rule, which Tailwind only understands once it is loaded.

## Changing a token

A change here reaches both applications, the storefront included.
Build both (`yarn nx build eco-store`, `yarn nx build eco-admin`) and look at the storefront in light, dark and high contrast before merging.

The colour roles are edited by hand. The Material schematic that generated the first version writes a new file without the hand-made parts of this one
(the lifted dark containers, the extra palettes, the spacing scale), so regenerating would lose them.
