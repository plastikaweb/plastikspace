# shared-form-util

## Table of Contents

- [shared-form-util](#shared-form-util)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
    - [Addons Extension](#addons-extension)
    - [Addons Wrapper](#addons-wrapper)
    - [Validators](#validators)
  - [Usage](#usage)
    - [Addons Example](#addons-example)
    - [URL Validator Example](#url-validator-example)
  - [API Reference](#api-reference)
    - [Addons Extension](#addons-extension-1)
    - [URL Validator](#url-validator)
  - [Running unit tests](#running-unit-tests)

## Description

A utility library that provides extensions, wrappers, and validators for Formly forms. It includes functionality for adding input addons (left/right icons or content) and custom form validators.

## Features

### Addons Extension

The addons extension allows you to add left and right addons (icons, buttons, or content) to form inputs. It automatically wraps fields with the appropriate wrapper when addons are configured.

### Addons Wrapper

A Formly wrapper component that handles the rendering of left and right addons for form inputs. It provides a consistent layout and styling for inputs with addons.

### Validators

Custom form validators including:

- URL validator: Validates that a field contains a valid URL format

## Usage

### Addons Example

```typescript
import { addonsExtension } from '@plastikspace/shared/form/util';

const fields: FormlyFieldConfig[] = [
  {
    key: 'search',
    type: 'input',
    props: {
      addonLeft: {
        icon: 'search',
      },
      addonRight: {
        icon: 'clear',
        onClick: field => field.formControl?.reset(),
      },
    },
  },
];
```

### URL Validator Example

```typescript
import { urlValidator } from '@plastikspace/shared/form/util';

const fields: FormlyFieldConfig[] = [
  {
    key: 'website',
    type: 'input',
    props: {
      label: 'Website URL',
    },
    validators: {
      validation: [urlValidator],
    },
  },
];
```

## API Reference

### Addons Extension

```typescript
function addonsExtension(field: FormlyFieldConfig): void;

interface AddonConfig {
  /**
   * Icon name to display
   */
  icon?: string;

  /**
   * Click handler for the addon
   */
  onClick?: (field: FormlyFieldConfig) => void;

  /**
   * Aria label for accessibility
   */
  aria?: string;
}

interface FormlyFieldProps {
  /**
   * Configuration for the left addon
   */
  addonLeft?: AddonConfig;

  /**
   * Configuration for the right addon
   */
  addonRight?: AddonConfig;
}
```

### URL Validator

```typescript
function urlValidator(control: AbstractControl): null | { url: true };
```

Validates that a form control value matches a URL pattern. Returns:

- `null` if the value is valid or empty
- `{ url: true }` if the value is invalid

## Running unit tests

Run `nx test shared-form-util` to execute the unit tests.
