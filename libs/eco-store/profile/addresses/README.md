# eco-store-profile-addresses-feature

- [eco-store-profile-addresses-feature](#eco-store-profile-addresses-feature)
  - [Features](#features)
  - [Components](#components)
    - [EcoStoreProfileAddressesFeatureComponent](#ecostoreprofileaddressesfeaturecomponent)

This library provides the address management feature for the user profile in the Eco Store application.

## Features

- **List addresses**: View all saved delivery addresses.
- **Add new address**: Form to add a new address with validation (zip, phone).
- **Edit address**: Modify existing address details (WIP).
- **Set default**: Easily set an address as the default for future orders.
- **Delete address**: Securely remove addresses with a confirmation dialog.
- **Form validation**: Real-time validation for Spanish zip codes and phone numbers.
- **Loading states**: Skeleton UI for improved perceived performance during data fetching.
- **Accessibility**: ARIA labels and semantic structure for screen reader support.
- **CanDeactivate Guard**: Warns users if they try to leave the page with unsaved changes.

## Components

### EcoStoreProfileAddressesFeatureComponent

The main feature component for displaying and managing user addresses. It uses `AddressCardComponent` from `@plastik/shared/address-card/ui` for the visual representation of each address and `@plastik/shared/form` for the address management forms.
