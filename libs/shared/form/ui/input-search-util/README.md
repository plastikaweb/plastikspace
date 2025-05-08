# input-search-util

## Table of Contents

- [input-search-util](#input-search-util)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
    - [Import](#import)
    - [Basic Example](#basic-example)
  - [API Reference](#api-reference)
    - [Function Parameters](#function-parameters)
  - [Running unit tests](#running-unit-tests)

## Description

A utility function that creates a Formly field configuration for a search input field. It provides a pre-configured search input with debounce functionality, a search icon, and a cancel button.

## Usage

### Import

```typescript
import { addSearchInput } from '@plastikspace/shared/form/ui/input-search-util';
```

### Basic Example

```typescript
const fields: FormlyFieldConfig[] = [
  addSearchInput({
    label: 'Search users',
    placeholder: 'Search users',
    key: 'userSearch',
    defaultValue: '',
  }),
  // other fields...
];
```

## API Reference

### Function Parameters

```typescript
function addSearchInput(
  /**
   * The label for the search input field
   */
  label: string,

  /**
   * The aria label for the cancel button
   * @default 'empty value'
   */
  cancelLabel?: string,

  /**
   * The key for the search input field
   * @default 'text'
   */
  key?: string,

  /**
   * The default value for the form control
   * @default ''
   */
  defaultValue?: string
): FormlyFieldConfig;
```

## Running unit tests

Run `nx test input-search-util` to execute the unit tests.
