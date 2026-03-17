# Product Base Unit Text Pipe

## Table of Contents

- [Product Base Unit Text Pipe](#product-base-unit-text-pipe)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [Input](#input)
    - [Output](#output)
  - [Unit Testing](#unit-testing)

## Overview

The `LlecoopProductBaseUnitTextPipe` is an Angular pipe that transforms a `LlecoopProductUnit` object into a human-readable text representation that describes the unit's base measurement.
This pipe helps display consistent and localized product unit information across the application.

## Usage

```html
<div>
  <p>Unit description: {{ product.unit | llecoopProductBaseUnitText }}</p>
</div>
```

## API Reference

### Input

- `value: LlecoopProductUnit` - A product unit object from the LLECOOP entities.

### Output

- `string` - A human-readable text describing the unit based on its type:
  - `'unit'` → 'unitat'
  - `'weight'` → 'per kg'
  - `'unitWithFixedVolume'` → '{base} l unitat'
  - `'unitWithFixedWeight'` → '{base} kg unitat'
  - `'unitWithVariableWeight'` → '{base} kg per unitat. Pes aproximat'
  - default → 'per unitat'

## Unit Testing

Run `nx test product-base-unit-text` to execute the unit tests.
