# eco-styles

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-0F172A?style=for-the-badge&logo=tailwindcss)

- [eco-styles](#eco-styles)
  - [Description](#description)
  - [What the file defines](#what-the-file-defines)
  - [The three opt-in partials](#the-three-opt-in-partials)
  - [Who can consume it](#who-can-consume-it)
  - [Usage](#usage)
  - [Changing a token](#changing-a-token)

## Description

The styles of the eco platform, shared by `eco-store` and `eco-admin`: the Material 3 token base and three small opt-in partials.
There is no TypeScript, no path alias and no targets.

| File                        | What it is                                                            |
| --------------------------- | --------------------------------------------------------------------- |
| `src/_eco_tokens.css`       | The token base. Plain CSS.                                            |
| `src/_eco_form_field.scss`  | The look of a form field in the eco family.                           |
| `src/_eco_error_shake.scss` | The class `eco-shake-on-error`: a container that shakes on a failure. |
| `src/_eco_auth_card.scss`   | The fill and the hairline edge of the card of the auth screens.       |

The token file was `apps/eco-store/src/styles/eco-store-theme.css` until AREF-09 moved it here.
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

## The three opt-in partials

None is part of the token base. An application gets one only by loading it from its global stylesheet.

### `eco_form_field`

One look for every Material form field of the eco family: 48px high, 12px corners, a 0.9rem text, a medium-weight label, and a 44px password toggle with an 18px icon.
It writes nothing of its own: it includes the mixin `material-form-field` of
[`core_input_material`](../../core/styles/util/material/README.md), which no application gets unless it asks.
`--mat-field-height` sets the height of the field per application (`48px` without it). The leading icon takes `--mat-sys-on-surface-variant` in both apps.

The partial needs `libs/core/styles/util/material/src` among the `includePaths` of the application.

How a field **behaves** — where its label rests, whether it keeps room for an error, which icon leads it — is not said here but in the Formly configuration of each form.

### `eco_error_shake`

`eco-shake-on-error` shakes its element once, for 0.4s, whenever an error or a warning of the shared alert (`plastik-shared-alert`) appears inside it:

```scss
.eco-shake-on-error:has(.plastik-alert--error, .plastik-alert--warning) { … }
```

It is CSS alone: the animation starts when the alert enters the DOM, so a screen that draws its alert again for every failed attempt shakes again every time.
It is switched off under `prefers-reduced-motion: reduce`. Both eco applications put the class on the card of their auth screens, through `AUTH_SCREEN_DEFAULTS`.

### `eco_auth_card`

The card of the auth screens (`plastik-auth-feature`, a Material card) looks the same way in both applications: a fill and a hairline edge in the palette's outline colour.

```scss
plastik-auth-feature .mat-mdc-card {
  background-color: var(--eco-auth-card-background, …);
  outline: 1px solid var(--mat-sys-outline-variant);
}
```

The rule is shared; the fill is not, because each application has a page of its own colour and the card has to stand apart from it.
Each one names its fill in `--eco-auth-card-background`, in its `_base.scss`:

| Application | The page                                            | `--eco-auth-card-background`                                                                            |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `eco-admin` | `surface-container-low` in light, `-lowest` in dark | `--eco-admin-card-background`, the colour of every card of the panel.                                   |
| `eco-store` | `surface-container`, under a gradient and a grain   | A surface role at 80%, over the blur of the card: `surface-container-low` in light, `-highest` in dark. |

Without the variable the card keeps the fill the shared screen gives it (`surface-container-low` at 80%).
In dark that role is darker than the storefront's page, which is why the storefront names another one.

- **An outline, not a border.** The shared screen switches the border of the card off and owns its box shadow, both with `!important`.
- **Out of every cascade layer.** The fill of the shared screen is a Tailwind utility, which lives in a layer; a rule outside the layers wins over it without `!important`.
- **One colour function per custom property.** The build writes fallbacks for `light-dark()` and for `color-mix()`. In a custom property of a global stylesheet that uses
  both, the fallbacks overwrite each other and the fill comes out opaque. The storefront therefore says its fill in two steps, `--eco-auth-card-surface` (the role for each
  theme) and `--eco-auth-card-background` (that role at 80%). A plain property of a component stylesheet is not affected (the shared alert mixes both and stays translucent).
  Check the computed alpha in a browser, not the numbers of the colour, after touching either.

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
             "includePaths": [
               "libs/core/styles/util/material/src",
               "libs/core/styles/util/tailwind4/src",
               "libs/eco/styles/src"
             ]
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
   @use 'eco_error_shake';
   @use 'eco_auth_card';
   @use 'core_input_material';
   @use 'eco_form_field';
   ```

   The order matters: `eco_tokens` ends in a `@custom-variant` rule, which Tailwind only understands once it is loaded.
   The last four lines are optional, each on its own; `eco_form_field` needs `core_input_material` before it.

## Changing a token

A change here reaches both applications, the storefront included.
Build both (`yarn nx build eco-store`, `yarn nx build eco-admin`) and look at the storefront in light, dark and high contrast before merging.

The colour roles are edited by hand. The Material schematic that generated the first version writes a new file without the hand-made parts of this one
(the lifted dark containers, the extra palettes, the spacing scale), so regenerating would lose them.
