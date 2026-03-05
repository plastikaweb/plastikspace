# eco-store-shared-store-status-banner

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [eco-store-shared-store-status-banner](#eco-store-shared-store-status-banner)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
    - [StoreStatusBannerComponent](#storestatusbannercomponent)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
      - [Example](#example)
  - [Running unit tests](#running-unit-tests)

## Description

A specialized component for displaying the operational status of the store.
It provides visual feedback to the user when the store is closed, opening soon, closing soon (urgency), manually closed by the tenant, or cancelled by the superuser.
It includes a countdown to the next opening date for scheduled closures or closing time for active ordering windows.

## Installation

```ts
import { StoreStatusBannerComponent } from '@plastik/eco-store/status-banner';
```

## Usage

### StoreStatusBannerComponent

Selector: `eco-store-status-banner`

#### Inputs

| Input          | Type                         | Default  | Description                                                                                                                             |
| -------------- | ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `status`       | `EcoStoreTenantWindowStatus` | `'OPEN'` | The current operational status of the store (`OPEN`, `CLOSED`, `OPENING_SOON`, `CLOSING_SOON`, `CLOSED_MANUALLY`, `CANCELLED`).         |
| `nextOpenDate` | `Date \| null`               | `null`   | The date when the store will open or close next. Used for the countdown calculation (for `CLOSED`, `OPENING_SOON`, and `CLOSING_SOON`). |
| `closedReason` | `string \| null`             | `null`   | A description or translation key for the reason why the store is manually closed.                                                       |

#### Outputs

| Output    | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `dismiss` | `void` | Emitted when the user clicks the dismiss button. |

#### Example

```html
<eco-store-status-banner
  [status]="storeStatus()"
  [nextOpenDate]="nextOpenDate()"
  [closedReason]="closedReason()"
  (dismiss)="onDismissBanner()" />
```

## View Transitions

This module incorporates smooth CSS view transitions to provide a seamless and visually appealing user experience during interactions and navigation.

## Running unit tests

Run `nx test eco-store-shared-store-status-banner` to execute the unit tests via Jest.
