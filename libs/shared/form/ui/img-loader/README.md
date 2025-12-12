# @plastik/shared/form/ui/img-loader

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/form/ui/img-loader](#plastiksharedformuiimg-loader)
  - [Description](#description)
  - [Usage](#usage)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
  - [Troubleshooting](#troubleshooting)
  - [Running unit tests](#running-unit-tests)

## Description

A **Formly-compatible image loader component** for Angular forms.
It allows users to upload images, displays upload progress, validates minimum dimensions and maximum file size, and supports previewing images from a URL or CDN.

## Usage

### Module Setup

Import the module in your feature module:

```typescript
import { ImgLoaderFormlyModule } from '@plastik/shared/form/ui/img-loader';

@NgModule({
  imports: [ImgLoaderFormlyModule],
})
export class FeatureModule {}
```

### Formly Configuration

The component type name is: `input-img-loader`.

```typescript
const fields: FormlyFieldConfig[] = [
  {
    key: 'image',
    type: 'input-img-loader',
    props: {
      label: 'Product image',
      required: true,
      maxSize: 2 * 1024 * 1024, // 2MB
      minHeight: 600,
      minWidth: 600,
      // Your upload logic here
      upload: async (file: File | null) => {
        console.log('Uploading...', file);
      },
      fileUrl: 'https://cdn.domain.com/image.jpg',
      title: 'Upload product image',
      folder: 'products',
    },
  },
];
```

## API Reference

### Props Interface

| Name         | Type                                                             | Default         | Description                                                        |
| :----------- | :--------------------------------------------------------------- | :-------------- | :----------------------------------------------------------------- |
| `upload`     | `(file: File \| null, folder?: string) => Promise<void> \| void` |                 | Function called on file selection. Handles upload logic. Required. |
| `progress`   | `number`                                                         | `0`             | Upload progress (0-100).                                           |
| `fileUrl`    | `string \| null`                                                 | `null`          | URL of the image used as the input value.                          |
| `title`      | `string`                                                         | `''`            | Title or label for the upload button.                              |
| `folder`     | `string`                                                         | `''`            | Folder or path for uploads (passed to `upload` function).          |
| `maxSize`    | `number`                                                         | `1048576` (1MB) | Maximum allowed file size in bytes.                                |
| `minHeight`  | `number`                                                         | `1024`          | Minimum image height in pixels.                                    |
| `minWidth`   | `number`                                                         | `1024`          | Minimum image width in pixels.                                     |
| `dimensions` | `ImageDimensions`                                                | `undefined`     | Dimensions of the image.                                           |
| `lcpImage`   | `boolean`                                                        | `false`         | Whether this image is a Largest Contentfull Paint (LCP) element.   |

## Troubleshooting

- **Image not uploading:** Ensure the `upload` prop is provided and handles the file upload correctly.
- **Validation errors:** Check that the uploaded image meets the minimum size and dimension requirements.
- **Preview not showing:** Verify that `fileUrl` or `cdnUrl` are set correctly and the image is accessible.

## Running unit tests

Run `nx test shared-form-ui-img-loader` to execute the unit tests.
