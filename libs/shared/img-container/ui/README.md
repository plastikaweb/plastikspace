# @plastik/shared/img-container/ui

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/img-container/ui](#plastiksharedimg-containerui)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [`SharedImgContainerComponent`](#sharedimgcontainercomponent)
  - [Running unit tests](#running-unit-tests)

## Description

The **Shared Image Container** is a robust wrapper component for Angular's `NgOptimizedImage`.
It simplifies the implementation of performant, accessible images across the application by providing built-in handling for:

- **Optimization**: Automatic file format selection and lazy loading via `NgOptimizedImage`.
- **Loading States**: Integrated loading spinner and smooth fade-in animations.
- **Error Handling**: Graceful fallback UI when image loading fails.
- **Layout Stability**: Enforces strict dimensions to prevent Cumulative Layout Shift (CLS).

## Features

- **Automatic Signals**: Uses Angular Signals for reactive state management of loading and error states.
- **Performance First**: Configured for `OnPush` change detection.
- **Fade-In Animation**: Provides a polished user experience with smooth transitions.
- **LCP Support**: Easy configuration for Largest Contentfull Paint (LCP) priority images.

## Installation

This library is part of the shared UI scope. Import it directly into your standalone components.

## Usage

Import `SharedImgContainerComponent` and add it to your imports array.

```typescript
import { Component } from '@angular/core';
import { SharedImgContainerComponent } from '@plastik/shared/img-container/ui';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedImgContainerComponent],
  template: `
    <div class="user-avatar">
      <plastik-img-container
        [src]="userImageUrl"
        [width]="150"
        [height]="150"
        [title]="'User Profile Picture'"
        [quality]="90"></plastik-img-container>
    </div>
  `,
})
export class UserProfileComponent {
  userImageUrl = 'https://example.com/avatar.jpg';
}
```

## API Reference

### `SharedImgContainerComponent`

**Selector:** `<plastik-img-container>`

| Input        | Type                                | Default                           | Description                                                           |
| :----------- | :---------------------------------- | :-------------------------------- | :-------------------------------------------------------------------- |
| `src`        | `string \| null`                    | Required                          | The source URL of the image.                                          |
| `title`      | `string`                            | Required                          | Alt text/Title for accessibility and SEO.                             |
| `dimensions` | `{ width: number; height: number }` | `undefined`                       | Optional object to set width and height together.                     |
| `quality`    | `number`                            | `80`                              | Image compression quality (1-100).                                    |
| `lcpImage`   | `boolean`                           | `false`                           | Set to `true` if this image is the Largest Contentfull Paint element. |
| `sizes`      | `string`                            | `'(max-width: 639px) 100vw, ...'` | Native `sizes` attribute for responsive images.                       |
| `thumbSizes` | `number[]`                          | `[100, 300, 500, 750, 1600]`      | Array of available thumbnail width sizes to generate `srcset`.        |

## Running unit tests

Run `nx test shared-img-container-ui` to execute the unit tests via [Jest](https://jestjs.io/).
