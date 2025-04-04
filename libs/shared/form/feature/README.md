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
    - [Global Configuration](#global-configuration)
      - [`FORM_DISABLE_TOKEN`](#form_disable_token)
    - [Available Form Types](#available-form-types)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Running unit tests](#running-unit-tests)
  - [Useful Links](#useful-links)

## Description

A feature module that provides a dynamic form container built on top of [Formly Library](https://formly.dev/).
It allows you to create forms dynamically from a configuration object, with built-in support for
validation, custom UI components, and form submission handling. It provides a flexible configuration
for form submission, model changes tracking, and accessibility features like auto-focus.

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
    <plastik-shared-form-feature
      [fields]="fields"
      [model]="model"
      [submitConfig]="submitConfig"
      [autoFocus]="true"
      (changeEvent)="onSubmit($event)"
      (temporaryChangeEvent)="onTemporaryChange($event)"
      (pendingChangesEvent)="onPendingChanges($event)">
    </plastik-shared-form-feature>
  `,
})
export class MyComponent {
  model = {
    email: 'test@test.com',
    name: 'test',
  };

  submitConfig: SubmitFormConfig = {
    label: 'Save',
    disableOnSubmit: true,
    emitOnChange: true,
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
    // Handle form submission.
  }

  onTemporaryChange(model: any) {
    // Handle temporary form changes while typing
  }

  onPendingChanges(hasPendingChanges: boolean) {
    // Handle form dirty state changes
  }
}
```

## API Reference

### Inputs

```typescript
interface SharedFormFeatureInputs {
  /**
   * The form controls configuration.
   * @required
   */
  fields: FormlyFieldConfig[];

  /**
   * Data model to populate the form.
   * @default null
   */
  model: T | null;

  /**
   * Configuration for the form submission.
   * The component will merge this with default values.
   */
  submitConfig: SubmitFormConfig | null;

  /**
   * Auto focus first input.
   * @default true
   */
  autoFocus: boolean;

  /**
   * Controls if the form is disabled due a condition (like loading or saving to an API).
   * @default false
   */
  disableForm: boolean;
}

interface SubmitFormConfig {
  /**
   * Button label text.
   * @default "Submit"
   */
  label?: string;

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Default enabled state.
   * @default true
   */
  enabledByDefault?: boolean;

  /**
   * CSS class to apply to the button.
   */
  buttonStyle?: string;

  /**
   * Reset form after submit.
   * @default false
   */
  resetOnSubmit?: boolean;

  /**
   * During form comparison, only compare common keys.
   * @default false
   */
  compareCommonKeysOnly?: boolean;

  /**
   * Keys to ignore when comparing form values.
   */
  ignoredKeysWhileComparing?: string[];

  /**
   * Emit change events as form values change.
   * @default false
   */
  emitOnChange?: boolean;

  /**
   * Disable the form after submission.
   * @default false
   */
  disableOnSubmit?: boolean;

  /**
   * Whether to show the submit button.
   * @default true
   */
  submitAvailable?: boolean;
}
```

### Outputs

```typescript
interface SharedFormFeatureOutputs {
  /**
   * Emits when form is submitted or when submitAvailable is false and model changes.
   */
  changeEvent: EventEmitter<T>;

  /**
   * Emits on temporary form value changes when emitOnChange is true.
   */
  temporaryChangeEvent: EventEmitter<T>;

  /**
   * Emits when form dirty state changes.
   */
  pendingChangesEvent: EventEmitter<boolean>;
}
```

### Global Configuration

#### `FORM_DISABLE_TOKEN`

This token can be used to set globally the disable state of the form due a condition (like loading or saving to an API).

```typescript
import { FORM_DISABLE_TOKEN } from '@plastik/shared/form/feature';

// use it with a route or an app configuration.
// ...
providers: [
  {
    provide: FORM_DISABLE_TOKEN,
    useFactory: () => signal(activitySelector),
  },
];
```

### Available Form Types

The module includes several custom form types located in `libs/shared/form/ui`:

- [`input-color-picker`](../ui/input-color-picker/README.md) - Color picker input with palette support.
- [`input-password-with-visibility`](../ui/input-password-with-visibility/README.md) - Password input with show/hide toggle.
- [`input-search-util`](../ui/input-search-util/README.md) - Search input with debounce functionality.
- [`input-table`](../ui/table/README.md) - Table input with sorting and pagination.
- [`textarea-with-counter`](../ui/textarea-with-counter/README.md) - Textarea with character counter.
- [`year-picker`](../ui/year-picker/README.md) - Year selection input.

## Troubleshooting

### Common Issues

1. Form not rendering: Ensure `SharedFormFeatureModule` is properly imported.
2. Validation not working: Check if validators are correctly configured.
3. Custom components not available: Verify the required UI modules are imported.
4. Submit button not showing: Check `submitConfig.submitAvailable` property.
5. Form not being disabled after submission: Verify `submitConfig.disableOnSubmit` is set to true.
6. No temporary changes emitted: Make sure `submitConfig.emitOnChange` is set to true.

## Running unit tests

Run `nx test shared-form-feature` to execute the unit tests.

## Useful Links

- [Formly Documentation](https://formly.dev/)
- [Angular Reactive Forms Guide](https://angular.io/guide/reactive-forms)
