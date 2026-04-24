# @plastik/eco-store/price-summary

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/price-summary](#plastikeco-storeprice-summary)
  - [Description](#description)
  - [Usage](#usage)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Running unit tests](#running-unit-tests)

## Description

A shared UI component that renders an order/cart price summary card. Displays subtotal, taxes, shipping cost, and total.
Optionally shows an action button and an alert when the store is closed or the trial period has expired.

Extracted from the former `CartOrderSummaryComponent` to be reusable across the **cart** feature steps and the **orders detail** view.

Part of the [**Eco-Store**](../../../../apps/eco-store/README.md) application.

## Usage

```html
<eco-store-price-summary
  [subtotal]="subtotal()"
  [taxes]="taxes()"
  [total]="total()"
  [shipping]="shipping()"
  [deliveryType]="deliveryType()"
  [actionButtonText]="'cart.summary.checkout' | translate"
  [actionRoute]="['/cistella', 'checkout']"
  [isStoreOpen]="isStoreOpen()"
  [nextOpenDate]="nextOpenDate()" />
```

Use content projection slots to add extra sections inside the card:

```html
<eco-store-price-summary ...>
  <div extra-shipping-content><!-- appears after shipping row --></div>
  <div extra-content><!-- appears after the total row --></div>
</eco-store-price-summary>
```

## Inputs

| Input              | Type                                  | Default    | Description                                                                      |
| ------------------ | ------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| `subtotal`         | `number` (**required**)               | —          | Pre-tax subtotal amount in EUR.                                                  |
| `taxes`            | `number` (**required**)               | —          | Total VAT amount in EUR.                                                         |
| `total`            | `number` (**required**)               | —          | Grand total (subtotal + taxes + shipping) in EUR.                                |
| `shipping`         | `number`                              | `0`        | Shipping/delivery cost in EUR.                                                   |
| `deliveryType`     | `EcoStoreTenantLogisticsDeliveryType` | `'pickup'` | Controls the shipping row label (`'pickup'` / `'delivery'`).                     |
| `submitAvailable`  | `boolean`                             | `true`     | Whether the action button is enabled.                                            |
| `actionButtonText` | `string`                              | `''`       | Label for the primary action button (hidden when empty).                         |
| `actionRoute`      | `string[]`                            | —          | Router path to navigate on button click (mutually exclusive with `actionClick`). |
| `isStoreOpen`      | `boolean`                             | `true`     | When `false`, shows a closed-store alert and hides the button.                   |
| `nextOpenDate`     | `Date \| null`                        | `null`     | If set, shows the next opening date inside the closed alert.                     |
| `isTrialExpired`   | `boolean`                             | `false`    | When `true`, triggers `trialExpiredClick` instead of navigation.                 |

## Outputs

| Output              | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| `actionClick`       | Emitted when the action button is clicked and no `actionRoute` is set.    |
| `trialExpiredClick` | Emitted when `isTrialExpired` is `true` and the action button is clicked. |

## Running unit tests

Run `nx test eco-store-price-summary` to execute the unit tests via [Vitest](https://vitest.dev/).
