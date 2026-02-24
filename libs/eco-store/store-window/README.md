# eco-store-store-window

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [eco-store-store-window](#eco-store-store-window)
  - [Description](#description)
  - [Features](#features)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A feature library containing the `StoreWindowComponent`, which displays the current status of an Eco Store (Open, Closed, Opening Soon, Closing Soon) along with a reactive countdown timer.

## Features

- **Dynamic Status**: Visualizes store status with icons, colors, and labels.
- **Closing Soon Urgency**: High-visibility state with a pulsing indicator to encourage last-minute orders.
- **Countdown Integration**: Displays a countdown timer when the store is closed, opening soon, or closing soon.
- **Shared Chip Integration**: Uses `SharedChipComponent` (`<plastik-shared-chip>`) from `@plastik/shared/chip/ui` for a modern, accessible, and semantically colored UI.
- **Responsive**: Adapts to different screen sizes and layouts.

## Inputs

| Name           | Type                         | Description                                                      |
| -------------- | ---------------------------- | ---------------------------------------------------------------- |
| `status`       | `EcoStoreTenantWindowStatus` | Current status (OPEN, CLOSED, OPENING_SOON, CLOSING_SOON, etc.). |
| `nextOpenDate` | `Date \| null`               | The date/time when the store will open or close next.            |
| `is24h`        | `boolean`                    | Whether the store is open 24 hours.                              |
| `closedReason` | `string \| null`             | Optional reason for why the store is closed.                     |

## How to use

Use the `eco-store-store-window` component to display the store status.

```html
<eco-store-store-window
  [status]="'CLOSED'"
  [nextOpenDate]="nextOpenDate"
  [is24h]="false"
  [closedReason]="'Maintenance'" />
```

## Running unit tests

Run `nx test eco-store-store-window` to execute the unit tests.
