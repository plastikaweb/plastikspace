# Shared Image Cropper Component

A reusable Angular component for selecting, dragging, dropping, and cropping images.
It provides validation for minimum dimensions and maximum file size.

## Features

- **File Selection**: Standard file input or drag and drop.
- **Cropping**: Interactive cropping tool with zoom functionality.
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

## Dependencies

- `@angular/material` (Button, Icon, Slider)
- `@ngx-translate/core`
- `ngx-image-cropper`
