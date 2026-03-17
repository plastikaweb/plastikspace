# Product Unit Step Pipe

## Table of Contents

- [Product Unit Step Pipe](#product-unit-step-pipe)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [Input](#input)
    - [Output](#output)
  - [Unit Testing](#unit-testing)

## Overview

The `LlecoopProductUnitStepPipe` is an Angular pipe that determines the appropriate
step increment for product quantities based on their unit type. It returns 0.1 for
weight-based products and 1.0 for all other product types, enabling appropriate
quantity selection in UI controls.

## Usage

```html
<div>
  <input
    type="number"
    [step]="product.unit | llecoopProductUnitStep"
    [(ngModel)]="product.quantity" />
</div>
```

## API Reference

### Input

- `value: LlecoopProductUnit` - A product unit object from the LLECOOP entities.

### Output

- `number` - The step increment value for the unit:
  - `'weight'` → 0.1 (for precise weight measurements)
  - All other types → 1.0 (for discrete units)

## Unit Testing

Run `nx test product-unit-step` to execute the unit tests.
