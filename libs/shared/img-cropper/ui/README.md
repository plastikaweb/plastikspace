# Shared Image Cropper Component

A reusable Angular component for selecting, dragging, dropping, and cropping images.
It provides validation for minimum dimensions and maximum file size.

## Features

- **File Selection**: Standard file input or drag and drop.
- **Cropping**: Interactive cropping tool with zoom functionality.
- **No dragging needed** (WCAG 2.5.7): zoom buttons and four pan buttons move the image under the
  crop area. A pan button stops, and turns `aria-disabled`, where the image would leave part of the
  crop area empty. A drag and the buttons share one offset, so zooming never resets it.
- **Named controls**: every icon-only button has an `aria-label` and a matching tooltip, and the zoom
  slider has a name (`common.image.crop.*` and `common.close` keys, which the host app translates).
- **Validation**: Minimum width/height and maximum file size checks.
- **Customization**: Configurable titles, dimensions, and image quality.
- **Outputs**: Emits the cropped image as a `File` object in `webp` format.

## Usage

```html
<plastik-img-cropper
  [config]="cropperConfig"
  (cropConfirmed)="onCrop($event)"
  (cropCancelled)="onCancel()" />
```

### Config Options

- `minWidth`: Minimum width (default: 200px)
- `minHeight`: Minimum height (default: 200px)
- `maxSizeBytes`: Maximum size (default: 2.5 MB)
- `quality`: Image quality (0-1, default: 0.92)
- `roundCropper`: Circular or square cropper (default: true)

### Translation keys

The host app provides `common.image.crop.{title,zoom,zoomIn,zoomOut,move,moveUp,moveDown,moveLeft,moveRight}`,
`common.image.upload.*`, `common.image.error.*`, `common.cancel`, `common.save` and `common.close`.

## Dependencies

- `@angular/material` (Button, Icon, Slider, Tooltip)
- `@ngx-translate/core`
- `ngx-image-cropper`
