# shared-util-view-transition

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [shared-util-view-transition](#shared-util-view-transition)
  - [Description](#description)
  - [ViewTransitionService](#viewtransitionservice)
    - [API Reference](#api-reference)
  - [ViewportTransitionNameDirective](#viewporttransitionnamedirective)
    - [Features](#features)
    - [Usage Example](#usage-example)
  - [Running unit tests](#running-unit-tests)

## Description

A utility library for managing Angular View Transitions. It provides a service to track the actively transitioning element ID and a directive to prevent broken animations for off-screen elements.

## ViewTransitionService

A global service to track which element's view transition is currently active.

### API Reference

| Element       | Type                           | Description                                    |
| :------------ | :----------------------------- | :--------------------------------------------- |
| `activeId`    | `Signal<string \| null>`       | A signal containing the currently active ID.   |
| `setActiveId` | `(id: string \| null) => void` | Updates the actively transitioning element ID. |

## ViewportTransitionNameDirective

A structural UI enhancement that uses the `IntersectionObserver` to suppress `view-transition-name` on elements that are out of the viewport.

### Features

- Fixes view transition visual bugs when element shifts offscreen.
- Automatically connects and disconnects `IntersectionObserver`.

### Usage Example

```html
<div plastikViewportTransitionName style="view-transition-name: product-image-1"></div>
```

## Running unit tests

Run `nx test shared-util-view-transition` to execute the unit tests.
