# shared-form-feature

## Table of Contents

- [shared-form-feature](#shared-form-feature)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
    - [HTML Element](#html-element)
    - [Module Setup](#module-setup)
    - [Basic Example](#basic-example)
  - [API Reference](#api-reference)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [Available Form Types](#available-form-types)
  - [Styling](#styling)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Running unit tests](#running-unit-tests)
  - [Useful Links](#useful-links)

## Description

A feature module that provides a dynamic form container built on top of [Formly Library](https://formly.dev/).
It allows you to create forms dynamically from a configuration object, with built-in support for validation, custom UI components, and form submission handling.

## Usage

### HTML Element

`<plastik-shared-form-feature>`

### Module Setup

Import the `SharedFormFeatureModule` in your component:

```typescript
import { SharedFormFeatureModule } from '@plastikspace/shared/form/feature';

@Component({
  // ...
  imports: [SharedFormFeatureModule],
})
```

### Basic Example

```typescript
@Component({
  selector: 'my-component',
  standalone: true,
  imports: [SharedFormFeatureModule],
  template: `
    <plastik-shared-form-feature [fields]="fields" [model]="model" (changeEvent)="onSubmit($event)">
    </plastik-shared-form-feature>
  `,
})
export class MyComponent {
  model = {
    email: 'test@test.com',
    name: 'test',
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: 'Email address',
        placeholder: 'Email address',
        required: true,
      },
      validators: {
        validation: Validators.compose([Validators.required, Validators.email]),
      },
    },
    {
      key: 'name',
      type: 'input',
      props: {
        type: 'text',
        label: 'Name',
        placeholder: 'Name',
        minLength: 8,
      },
    },
  ];

  onSubmit(model: any) {
    // Handle form submission
  }
}
```

## API Reference

### Inputs

```typescript
interface SharedFormFeatureInputs {
  /**
   * The form controls configuration
   * @required
   */
  fields: FormlyFieldConfig[];

  /**
   * Data model to populate the form
   * @default null
   */
  model: T | null;

  /**
   * Show submit button
   * @default true
   */
  submitAvailable: boolean;

  /**
   * Configuration for submit button
   */
  submitConfig: SubmitFormConfig;
}

interface SubmitFormConfig {
  /**
   * Button text
   * @default "Submit"
   */
  text?: string;

  /**
   * Button icon (mutually exclusive with image)
   */
  icon?: string;

  /**
   * Button image URL (takes precedence over icon)
   */
  image?: string;
}
```

### Outputs

```typescript
interface SharedFormFeatureOutputs {
  /**
   * Emits when form is submitted
   */
  changeEvent: EventEmitter<T>;

  /**
   * Emits on form value changes
   */
  temporaryChangeEvent: EventEmitter<T>;
}
```

### Available Form Types

The module includes several custom form types located in `libs/shared/form/ui`:

- [`input-color-picker`](../ui/input-color-picker/README.md) - Color picker input with palette support
- [`input-password-with-visibility`](../ui/input-password-with-visibility/README.md) - Password input with show/hide toggle
- [`input-search-util`](../ui/input-search-util/README.md) - Search input with debounce functionality
- [`input-table`](../ui/table/README.md) - Table input with sorting and pagination
- [`textarea-with-counter`](../ui/textarea-with-counter/README.md) - Textarea with character counter
- [`year-picker`](../ui/year-picker/README.md) - Year selection input

## Styling

Customize the appearance using CSS variables in your app's `styles/_theme.scss`:

```scss
:root {
  --plastik-mdc-floating-label-color: rgb(var(--primary));
  // Add more custom variables here
}
```

## Troubleshooting

### Common Issues

1. Form not rendering: Ensure `SharedFormFeatureModule` is properly imported
2. Validation not working: Check if validators are correctly configured
3. Custom components not available: Verify the required UI modules are imported
4. Submit button not showing: Check `submitAvailable` property
5. Button icon/image not displaying: Ensure `submitConfig` is properly configured

## Running unit tests

Run `nx test shared-form-feature` to execute the unit tests.

## Useful Links

- [Formly Documentation](https://formly.dev/)
- [Angular Reactive Forms Guide](https://angular.io/guide/reactive-forms)
