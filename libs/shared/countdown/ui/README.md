# @plastik/shared/countdown/ui

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/countdown/ui](#plastiksharedcountdownui)
  - [Description](#description)
  - [Features](#features)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable Angular component for displaying countdowns with a customizable prefix, segments, and styling.

## Features

- **Segmented Display**: Renders countdowns as a series of time segments (e.g., `12m`, `30s`).
- **Animated Separators**: Supports custom separators with optional pulsing animations.
- **Translatable**: Integrated with `ngx-translate` for localized prefixes.
- **Customizable**: Accepts custom CSS classes for flexible styling.

## Inputs

| Name       | Type       | Default | Description                                                  |
| ---------- | ---------- | ------- | ------------------------------------------------------------ |
| `segments` | `string[]` | `[]`    | An array of time segments to display (e.g., `["2d", "5h"]`). |
| `prefix`   | `string`   | `''`    | A translation key or string to display before the countdown. |
| `class`    | `string`   | `''`    | Custom CSS classes to apply to the container.                |

## How to use

Import the `SharedCountdownUiComponent` and use it in your template.

```html
<plastik-countdown
  [segments]="['2d', '5h', '30m']"
  [prefix]="'Starts in'"
  class="font-bold text-red-500"></plastik-countdown>
```

## Running unit tests

Run `nx test shared-countdown-ui` to execute the unit tests.
