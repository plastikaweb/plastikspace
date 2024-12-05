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
    - [Return Value](#return-value)
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
  addSearchInput('Search users', 'Clear search', 'userSearch'),
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
  key?: string
): FormlyFieldConfig;
```

### Return Value

Returns a `FormlyFieldConfig` object with the following features:

- Input type: 'search'
- Debounce: 250ms
- Left addon: Search icon
- Right addon: Cancel button (resets the field)
- Default configuration:
  - Required: false
  - Max length: 256
  - Min length: 1
  - Class: 'w-full'

## Running unit tests

Run `nx test input-search-util` to execute the unit tests.
