# shared-form-ui-text

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

## Table of Contents

- [shared-form-ui-text](#shared-form-ui-text)
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
  - [Running unit tests](#running-unit-tests)

## Description

A **Formly-compatible text display component** for Angular forms.
It displays static text messages within forms without user input or value return. This is useful for showing informational messages, instructions, or static content within a form context.

## Usage

### HTML Element

`<plastik-shared-form-ui-text>`

### Module Setup

Import the module in your feature module:

```typescript
import { TextFormlyModule } from '@plastik/shared/form/text';

@NgModule({
  imports: [TextFormlyModule],
})
export class FeatureModule {}
```

### Formly Configuration

The component type name is: `text`.

### Basic Example

```typescript
const fields: FormlyFieldConfig[] = [
  {
    type: 'text',
    props: {
      text: 'Please complete all required fields before submitting.',
      containerClasses: 'bg-blue-50 p-4 rounded-md text-sm',
      icon: 'info',
    },
  },
];
```

## API Reference

### Props Interface

| Name               | Type     | Default | Description                                       |
| :----------------- | :------- | :------ | :------------------------------------------------ |
| `text`             | `string` |         | The text message to display. **Required.**        |
| `containerClasses` | `string` | `''`    | Additional CSS classes for the container element. |

**Note:** This component does not return any value. It is a display-only component.

## Troubleshooting

### Common Issues

1. **Text not displaying:** Ensure the `text` prop is provided and not empty.
2. **Styling not applied:** Verify that `containerClasses` contains valid CSS classes that are available in your application.
3. **Component not rendering:** Check that `TextFormlyModule` is properly imported in your feature module.

## Running unit tests

Run `nx test shared-form-ui-text` to execute the unit tests.
