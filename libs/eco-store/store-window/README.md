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

A feature library containing the `StoreWindowComponent`, which displays the current status of an Eco Store (Open, Closed, Opening Soon) along with a countdown timer.

## Features

- **Dynamic Status**: Visualizes store status with icons, colors, and labels.
- **Countdown Integration**: Displays a countdown timer when the store is closed or opening soon.
- **Material 3 Design**: Uses Angular Material Chips for a modern, accessible UI.
- **Responsive**: Adapts to different screen sizes and layouts.

## Inputs

| Name           | Type                         | Description                                       |
| -------------- | ---------------------------- | ------------------------------------------------- |
| `status`       | `EcoStoreTenantWindowStatus` | Current status of the store (OPEN, CLOSED, etc.). |
| `nextOpenDate` | `Date \| null`               | The date and time when the store will open next.  |
| `is24h`        | `boolean`                    | Whether the store is open 24 hours.               |
| `closedReason` | `string \| null`             | Optional reason for why the store is closed.      |

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
