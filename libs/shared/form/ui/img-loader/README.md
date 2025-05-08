# input-img-loader

## Table of Contents

- [input-img-loader](#input-img-loader)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
    - [HTML Element](#html-element)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
    - [Basic Example](#basic-example)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Running unit tests](#running-unit-tests)

## Description

A Formly-compatible image loader component for Angular forms.
It allows users to upload images, displays upload progress, validates minimum dimensions and maximum file size, and supports previewing images from a URL or CDN.
Designed for seamless integration into reactive forms and custom upload logic.

## Usage

### HTML Element

`<plastik-input-img-loader>`

### Module Setup

To use the `input-img-loader` type, import the following modules in your feature module:

- `ImgLoaderFormlyModule`
- [SharedFormFeatureModule](../../feature/README.md)

### Formly Configuration

The component type name is: `input-img-loader`

### Basic Example

```typescript
import { FormlyFieldConfig } from '@ngx-formly/core';

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
      upload: async (file: File | null) => {
        // Your upload logic here
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

| Name        | Type                                                             | Default         | Description                                                        |
| ----------- | ---------------------------------------------------------------- | --------------- | ------------------------------------------------------------------ |
| `upload`    | `(file: File \| null, folder?: string) => Promise<void> \| void` |                 | Function called on file selection. Handles upload logic. Required. |
| `progress`  | `number`                                                         | `0`             | Upload progress.(0-100).                                           |
| `fileUrl`   | `string \| null`                                                 | `null`          | URL of the image used as the input value.                          |
| `title`     | `string`                                                         | `''`            | Title or label for the upload button.                              |
| `folder`    | `string`                                                         | `''`            | Folder or path for uploads (passed to `upload` function).          |
| `maxSize`   | `number`                                                         | `1048576` (1MB) | Maximum allowed file size in bytes.                                |
| `minHeight` | `number`                                                         | `1024`          | Minimum image height in pixels.                                    |
| `minWidth`  | `number`                                                         | `1024`          | Minimum image width in pixels.                                     |
| `imgHeight` | `number`                                                         | `200`           | Height of the container for the image preview.                     |
| `imgWidth`  | `number`                                                         | `200`           | Width of the image preview.                                        |

## Troubleshooting

### Common Issues

- **Image not uploading:** Ensure the `upload` prop is provided and handles the file upload correctly.
- **Validation errors:** Check that the uploaded image meets the minimum size and dimension requirements.
- **Preview not showing:** Verify that `fileUrl` or `cdnUrl` are set correctly and the image is accessible.

## Running unit tests

Run `nx test input-img-loader` to execute the unit tests.
