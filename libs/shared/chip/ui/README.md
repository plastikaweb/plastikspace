# shared-chip-ui

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [shared-chip-ui](#shared-chip-ui)
  - [Description](#description)
  - [SharedChipComponent (`<plastik-shared-chip>`)](#sharedchipcomponent-plastik-shared-chip)
    - [Features](#features)
    - [API Reference](#api-reference)
    - [Usage Example](#usage-example)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable Angular component for displaying semantic chips/badges with icon support and built-in accessibility.

## SharedChipComponent (`<plastik-shared-chip>`)

This component provides consistent styling for various status indicators, unit badges, and tags throughout the application.

### Features

- **Semantic Types**: Supports multiple visual styles based on intent.
- **Icon Integration**: Seamlessly integrates with `MatIconModule`. The icon takes the chip's text colour, so both keep the same contrast in light and dark mode.
- **Colours**: `tertiary` uses Material roles (`bg-sys-tertiary-container`, `text-sys-on-tertiary-container`), which follow the system theme.
  `info`, added for the eco status families (AREF-10), uses the `--info-*` palette as `success` uses its own.
  The other types also use palette classes with `dark:` variants, which follow only the `.dark` class (see `documentation/css-styles.md`, "Bad practices to avoid").
- **Accessibility**: Built-in `role="status"` and configurable `aria-label`.
- **Performance**: Built using Angular Signals and `OnPush` change detection.

### API Reference

| Input         | Type             | Default     | Description                                |
| :------------ | :--------------- | :---------- | :----------------------------------------- |
| `label`       | `string`         | `undefined` | The text label to display inside the chip. |
| `icon`        | `string`         | `undefined` | Optional icon name from Material Icons.    |
| `type`        | `SharedChipType` | `'neutral'` | Semantic type: `primary`, `success`, etc.  |
| `customClass` | `string`         | `''`        | Additional CSS classes for custom styling. |
| `role`        | `string`         | `'status'`  | The ARIA role for the chip.                |
| `ariaLabel`   | `string`         | `label()`   | Custom ARIA label for screen readers.      |

### Usage Example

```html
<plastik-shared-chip label="Unit Badge" type="primary" icon="info"> </plastik-shared-chip>
```

## Running unit tests

Run `nx test shared-chip-ui` to execute the unit tests.
