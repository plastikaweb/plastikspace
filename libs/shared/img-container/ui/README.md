# shared-img-container-ui

- [shared-img-container-ui](#shared-img-container-ui)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A wrapper component for the Angular `img` tag that uses the `NgOptimizedImage` directive to optimize image loading and rendering.
This component simplifies the implementation of optimized images while providing a consistent styling and configuration interface.

## Dependencies

- NgOptimizedImage

## Inputs

| Name       | Type      | Description                                                           | Default       |
| ---------- | --------- | --------------------------------------------------------------------- | ------------- |
| `src`      | `string`  | The source URL of the image (required)                                | `undefined`   |
| `width`    | `number`  | The width of the image in pixels (required)                           | `undefined`   |
| `height`   | `number`  | The height of the image in pixels. If not provided, defaults to width | `width value` |
| `quality`  | `number`  | Image quality parameter (1-100)                                       | `80`          |
| `title`    | `string`  | Image title/alt text for accessibility                                | `undefined`   |
| `lcpImage` | `boolean` | Whether this image is a Largest Contentful Paint element              | `false`       |

## How to use

- Import the `SharedImgContainerComponent` in your parent standalone component or module.

```typescript
// app.component.ts
import { SharedImgContainerComponent } from '@plastikspace/shared/img-container/ui';

@Component({
  // ...
  imports: [SharedImgContainerComponent],
})
export class AppComponent {
  // Component logic
}
```

- Use the component in your template:

```html
<!-- Basic usage -->
<plastik-shared-img-container [src]="'https://example.com/image.jpg'" [width]="400">
</plastik-shared-img-container>

<!-- Advanced usage with all options -->
<plastik-shared-img-container
  [src]="'https://example.com/image.jpg'"
  [width]="400"
  [height]="300"
  [quality]="90"
  [title]="'My Image Description'"
  [lcpImage]="true">
</plastik-shared-img-container>
```

## Running unit tests

Run `nx test shared-img-container-ui` to execute the unit tests.
