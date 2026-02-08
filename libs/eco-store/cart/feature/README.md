# @plastik/eco-store/cart/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/cart/feature](#plastikeco-storecartfeature)
  - [Description](#description)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Implementation notes](#implementation-notes)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Route Configuration](#route-configuration)
    - [Components](#components)
      - [CartOrderPriceSlotsComponent](#cartorderpriceslotscomponent)
      - [CartOrderSummaryComponent](#cartordersummarycomponent)
      - [NewPriceWarningComponent](#newpricewarningcomponent)
  - [Cart Steps](#cart-steps)
    - [Shipping Unavailable Component](#shipping-unavailable-component)
  - [Running unit tests](#running-unit-tests)

## Description

The **Cart Feature** library provides the complete shopping cart checkout flow for the Eco Store application. It implements a multi-step checkout process using Angular Material Stepper with route-based navigation.

## Features

- **Multi-Step Checkout**: Four-step process (Summary, Shipping, Payment, Confirmation).
- **Route-Based Navigation**: Each step has its own route for direct access and browser history support.
- **Linear Stepper**: Guides users through the checkout process in sequence.
- **Lazy-Loaded Steps**: Each step component is lazy-loaded for optimal performance.
- **Cart Summary**: Displays cart items grouped by category with quantity controls.
- **Material Design**: Uses Angular Material components for a consistent UI.

## Architecture

The cart feature uses a routed stepper pattern where:

- **`EcoStoreCartComponent`**: Shell component that renders the `mat-stepper` and syncs it with the router.
- **Child Routes**: Each step is a separate route that loads its component lazily.
- **URL Sync**: The stepper automatically updates when the URL changes and vice versa.

## Implementation notes

This section provides a few developer-focused notes and examples for common integration points.

Example Formly field configuration:

```typescript
{
  key: 'shipping',
  type: 'input',
  props: { type: 'hidden' },
  hooks: {
    onInit: (field) => {
      // compute and set shipping amount on init or when related fields change
      field.formControl?.setValue(computedShippingAmount);
    }
  }
}
```

- Shipping form field naming

  The shipping form uses simplified field names for better code organization:
  - `method`: Shipping delivery method ('pickup' or 'delivery')
  - `address`: Shipping address selection
  - `day`: Delivery day selection
  - `time`: Delivery time slot selection
  - `shipping`: Computed shipping cost

- Custom Label Hooks Pattern

  Custom label sections use a declarative hook pattern where validation and dynamic label updates are defined as separate hook functions with their own linked field keys.
  This allows independent logic reuse across multiple sections.

  Example:

```typescript
type HookFunction = {
  fn: (field: FormlyFieldConfig, linkedFieldKeys: string[]) => void;
  linkedFieldKeys: string[];
};

setCustomLabel('method', 'cart.shipping.method.title', 'counter_1', [
  {
    fn: checkCustomLabelValidation,
    linkedFieldKeys: ['method'],
  },
]);
```

- Stepper / router synchronization

  The cart shell (`EcoStoreCartComponent`) derives the selected step index from router events.
  Before navigating to a step as a response to a user action, the component compares the currently-derived index with the target index and only navigates when they differ.
  This prevents navigation loops and reduces unnecessary router calls.

- Formly UI components used by the cart

  The shared Formly UI components used in the shipping step (such as `address-selector` and `shipping-method-selector`) render card-based controls.
  For styling reasons the native radio input may be visually hidden; automated tests should select options by semantic values or data attributes rather than relying on a visible radio element.

- Tenant address integration

  The shipping form integrates with the tenant store to provide pickup location addresses.
  When the shipping method is set to 'pickup', the address selector displays tenant addresses
  (from `tenantStore.tenantAddressesContacts()`). For delivery, it shows user addresses.
  The selected pickup address ID is used to retrieve location-specific time slots via
  `getTenantDeliveryOptionSlotsDays()` and `getTenantDeliveryOptionSlotsTimes()`.

If you need, I can add short code examples showing how to select options in tests or how to compute shipping amount based on tenant configuration.

## Installation

This library is part of the `@plastik/eco-store` scope. Import the routes in your application routing configuration.

## Usage

### Route Configuration

```typescript
import { Route } from '@angular/router';
import { ecoStoreCartRoutes } from '@plastik/eco-store/cart/feature';

export const routes: Route[] = [
  {
    path: 'carret',
    children: ecoStoreCartRoutes,
  },
];
```

### Components

#### CartOrderPriceSlotsComponent

The `CartOrderPriceSlotsComponent` is a presentational component that displays a progress bar and shipping cost information based on a set of pricing tiers.
It shows the user how much they need to add to their cart to reach the next shipping tier or to get free shipping.

**Inputs:**

- `tiers: EcoStoreTenantLogisticsDeliveryTier[]` (required): An array of shipping tiers. Each tier object must have a `min` (the minimum cart total for that tier) and a `cost` (the shipping cost for that tier).
- `cartTotal: number` (required): The current total of the shopping cart.

**Example Usage:**

```html
<eco-cart-order-price-slots
  [tiers]="tenantStore.getTenantDeliveryPriceTiers()"
  [cartTotal]="cartStore.subtotal() + cartStore.tax()">
</eco-cart-order-price-slots>
```

#### CartOrderSummaryComponent

The `CartOrderSummaryComponent` is a presentational component that displays a summary of the order, including the total cost, shipping cost, and tax.

**Inputs:**

- `submitAvailable: boolean`: Indicates whether the order can be submitted.
- `subtotal: number` (required): The current shopping cart subtotal.
- `taxes: number` (required): The current tax.
- `total: number` (required): The current shopping cart total (subtotal + taxes + shipping).
- `shipping: number`: The shipping cost.
- `actionButtonText: string`: The button label.
- `actionRoute: string[]`: The route to redirect on clicking the action button.
- `deliveryType: EcoStoreTenantLogisticsDeliveryType`: The delivery type for the order.

**Example Usage:**

```html
<eco-cart-order-summary
  submitAvailable="true"
  subtotal="300"
  total="340"
  taxes="40"
  shipping="5"
  actionButtonText="submit"
  actionRoute="['home']"
  deliveryType="delivery">
</eco-cart-order-summary>
```

#### NewPriceWarningComponent

The `NewPriceWarningComponent` is a smart presentational component that displays price change notifications in the cart summary.
It automatically adapts its styling and messaging based on whether the price has increased or decreased, providing clear visual feedback to users.

**Features:**

- **Smart Visual Differentiation**:
  - Price drops use green/primary color scheme with `trending_down` icon
  - Price increases use terracotta/tertiary color scheme with `trending_up` icon
- **Accessibility-First Design**:
  - Semantic HTML using `<aside>` element for complementary content
  - ARIA roles (`status` for price drops, `alert` for increases)
  - ARIA labels for screen reader announcements
  - Color-independent indicators (icons + text)
- **Responsive Layout**: Adapts from vertical to horizontal layout on larger screens
- **Material Design + Tailwind**: Combines Material icons with Tailwind utility classes
- **Internationalized**: Supports Catalan, Spanish, and English

**Inputs:**

- `currentPrice: number` (required): The current price of the product
- `oldPrice: number` (required): The previous price of the product

**Behavior:**

The component uses a computed signal `isPriceDrop()` to determine the price direction:

- When `currentPrice < oldPrice`: Shows success state (green) with "Price drop!" message
- When `currentPrice >= oldPrice`: Shows warning state (terracotta) with "Price increase!" message

**Translation Keys:**

All text content is internationalized under the `cart.summary` namespace:

- `price-drop`: Message displayed for price reductions
- `price-increase`: Message displayed for price hikes
- `old-price`: Label for the previous price

**Example Usage:**

```html
<eco-new-price-warning [currentPrice]="item.product.priceWithIva" [oldPrice]="item.oldPriceWithIva">
</eco-new-price-warning>
```

**Styling:**

- Compact layout with minimal padding for reduced visual disruption
- Uses CSS grid for consistent icon-text alignment
- Custom Material icon size (18px × 18px)
- Dynamic color classes bound to `isPriceDrop()` signal
- Icon colors applied via Material mixins for theme consistency

## Cart Steps

1. **Summary** (`/cistella/resum`): View cart items, adjust quantities, remove items.
2. **Shipping** (`/cistella/enviament`): Enter shipping address and delivery preferences.
   - **Shipping Unavailable** (`/cistella/enviament/no-disponible`): Displayed when shipping is not configured for the store.
3. **Confirmation** (`/cistella/confirmacio`): Review order and confirm purchase.

### Shipping Unavailable Component

The `ShippingUnavailableComponent` is displayed when the tenant's shipping configuration is incomplete or unavailable.
It provides users with information about the situation and guidance on what they can do while waiting.

**Features:**

- Centered layout with a clean, informative design
- Icon-based visual feedback using Material icons
- Expandable information panel explaining available actions
- Internationalized content in Catalan, Spanish, and English
- Responsive design with proper spacing and typography

**Guard Protection:**
The component is protected by the `shippingUnavailableGuard` which checks if shipping is unavailable and redirects accordingly.

**Translation Keys:**
All text content is internationalized under the `cart.steps.shipping.unavailable` namespace:

- `title`: Main heading text
- `description.part1`, `part2`, `part3`: Description text split for formatting
- `info.title`: Expandable section heading
- `info.item1`, `item2`, `item3`: List of available actions
- `actions.goToShop`: Button text to return to store

**Styling:**

- Uses Angular Material components (`mat-expansion-panel`, `mat-icon`, `mat-button`)
- Tailwind utility classes for layout and spacing in the template
- Material Design theming via SCSS mixins for consistent color application
- Vertically centered in the available container space

**Example Route Configuration:**

```typescript
{
  path: 'no-disponible',
  loadComponent: () =>
    import('./eco-store-cart-steps/shipping/shipping-unavailable/shipping-unavailable.component')
      .then(m => m.ShippingUnavailableComponent),
  canActivate: [shippingUnavailableGuard],
}
```

## Running unit tests

Run `nx test eco-store-cart-feature` to execute the unit tests via Jest.
