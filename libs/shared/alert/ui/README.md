# shared-alert-ui

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [shared-alert-ui](#shared-alert-ui)
  - [Description](#description)
  - [SharedAlertUiComponent (`<plastik-shared-alert>`)](#sharedalertuicomponent-plastik-shared-alert)
    - [Features](#features)
    - [API Reference](#api-reference)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
    - [Content Projection Slots](#content-projection-slots)
    - [Usage Example](#usage-example)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable Angular alert/banner component for displaying contextual feedback messages with semantic type variants, icon support, optional close button, and named content projection slots.

## SharedAlertUiComponent (`<plastik-shared-alert>`)

Renders an accessible alert banner with a left-border colour scheme driven by the `AlertType`. Supports rich content via named slots for title, subtitle, and secondary actions.

### Features

- **Semantic Types**: `INFO`, `WARNING`, `SUCCESS`, `ERROR` — each maps to a distinct colour scheme and default icon.
- **Icon Override**: Pass a custom Material icon name via the `icon` input to replace the default type icon.
- **Named Content Slots**: Project title, subtitle, and secondary action content independently.
- **Closable**: Optional close button that emits a `closed` event.
- **Accessibility**: Host element carries `role="alert"` and `aria-live="polite"` automatically.
- **Performance**: Built with Angular Signals and `OnPush` change detection.

### API Reference

#### Inputs

| Input      | Type        | Required | Default | Description                                              |
| :--------- | :---------- | :------- | :------ | :------------------------------------------------------- |
| `type`     | `AlertType` | Yes      | —       | Semantic type: `INFO`, `WARNING`, `SUCCESS`, or `ERROR`. |
| `icon`     | `string`    | No       | `''`    | Material icon name to override the default type icon.    |
| `closable` | `boolean`   | No       | `false` | When `true`, renders a close button in the alert.        |

#### Outputs

| Output   | Type   | Description                                    |
| :------- | :----- | :--------------------------------------------- |
| `closed` | `void` | Emitted when the user clicks the close button. |

### Content Projection Slots

| Attribute        | Element     | Description                                         |
| :--------------- | :---------- | :-------------------------------------------------- |
| `alertTitle`     | Any element | Projected into the bold title area of the alert.    |
| `alertSubtitle`  | Any element | Projected into the smaller subtitle area.           |
| `alertSecondary` | Any element | Projected into the trailing action area (e.g. CTA). |

> **Note**: When using content projection inside Angular `@if` blocks, ensure each projectable node is the sole root node of its block to avoid `controlFlowPreventingContentProjection` warnings.
> Split multiple projected nodes across separate `@if` blocks if needed.

### Usage Example

```html
<plastik-shared-alert type="WARNING" [closable]="true" (closed)="onClose()">
  <strong alertTitle>Your trial is ending soon</strong>
  <span alertSubtitle>You have 3 days left in your trial period.</span>
  <button alertSecondary mat-flat-button>Upgrade now</button>
</plastik-shared-alert>
```

## Running unit tests

```bash
yarn nx test shared-alert-ui
```
