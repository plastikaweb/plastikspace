# Product Unit Suffix Pipe

## Table of Contents

- [Product Unit Suffix Pipe](#product-unit-suffix-pipe)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [Input](#input)
    - [Output](#output)
  - [Unit Testing](#unit-testing)

## Overview

The `LlecoopProductUnitSuffixPipe` is an Angular pipe that transforms a `LlecoopProductUnit` object into the appropriate unit suffix for display purposes.
It returns either 'kg' for weight-based products or 'u' (unit) for quantity-based products.

## Usage

```html
<div>
  <p>{{ product.quantity }} {{ product.unit | llecoopProductUnitSuffix }}</p>
</div>
```

## API Reference

### Input

- `value: LlecoopProductUnit` - A product unit object from the LLECOOP entities.

### Output

- `string` - The appropriate suffix for the unit:
  - `'weight'` → 'kg'
  - All other types → 'u'

## Unit Testing

Run `nx test product-unit-suffix` to execute the unit tests.
