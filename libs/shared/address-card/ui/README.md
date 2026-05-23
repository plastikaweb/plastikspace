# shared-address-card-ui

- [shared-address-card-ui](#shared-address-card-ui)
  - [Components](#components)
    - [AddressCardComponent](#addresscardcomponent)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
      - [Content Projection Slots](#content-projection-slots)
      - [Accessibility](#accessibility)

This library was generated to provide a presentational component for displaying user addresses.

## Components

### AddressCardComponent

A presentational component for displaying a user address.

#### Inputs

- `address: UserContact` (required)
- `selected: boolean` (default: `false`)
- `disabled: boolean` (default: `false`)
- `interactive: boolean` (default: `true`)

#### Outputs

- `selectionChange: EventEmitter<void>`

#### Content Projection Slots

- `indicator`: Slot for selection indicators (e.g., radio buttons).
- `actions`: Slot for action buttons (e.g., edit button).

#### Accessibility

The component includes a computed `fullAriaLabel` that provides a complete address description to
screen readers. This label combines the address name, street, zip code, and city to ensure
users with assistive technologies have full context when interacting with address cards.
