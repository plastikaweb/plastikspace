# @plastik/eco-store/shared/utils

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-%2300A86B.svg?style=for-the-badge&logo=google-translate&logoColor=white)

- [@plastik/eco-store/shared/utils](#plastikeco-storesharedutils)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [HumanizeUnitPipe](#humanizeunitpipe)
    - [PocketBaseImageUrlPipe](#pocketbaseimageurlpipe)
  - [Running unit tests](#running-unit-tests)

## Description

Utility helpers shared across Eco-Store libraries. Currently includes a localized unit formatter pipe for product units.

## Features

- `HumanizeUnitPipe`: Formats numeric values with unit-aware suffixes (`kg`, `g`, `L`, `mL`) based on the `ProductUnitType`.
- Locale-aware number formatting using `Intl.NumberFormat` and the current language from `@ngx-translate/core`.
- Standalone Angular pipe for easy import in components.

## Installation

This library is part of the `@plastik/eco-store` scope and is available via workspace path alias:

```ts
import { HumanizeUnitPipe } from '@plastik/eco-store/shared/utils';
```

## Usage

### HumanizeUnitPipe

Import the pipe into a standalone component and use it in templates.

```ts
import { Component } from '@angular/core';
import { HumanizeUnitPipe } from '@plastik/eco-store/shared/utils';
import { ProductUnitType } from '@plastik/eco-store/entities';

@Component({
  selector: 'demo-humanize-unit',
  imports: [HumanizeUnitPipe],
  template: `
    <!-- Outputs '500 g' when locale uses non-breaking space -->
    <span>{{ 0.5 | humanizeUnit: 'weight' }}</span>

    <!-- Outputs '1 kg' -->
    <span>{{ 1 | humanizeUnit: 'unitWithFixedWeight' }}</span>

    <!-- Outputs '750 mL' -->
    <span>{{ 0.75 | humanizeUnit: 'volume' }}</span>
  `,
})
export class DemoHumanizeUnitComponent {}
```

The pipe accepts:

- `value: number | null | undefined`
- `unitType: ProductUnitType` (`'weight' | 'volume' | 'unit' | 'unitWithFixedWeight' | 'unitWithVariableWeight' | 'unitWithFixedVolume' | 'unitWithVariableVolume'`)

### PocketBaseImageUrlPipe

Transforms a source object (containing `id` and `collectionId`) and an image filename into a PocketBase URL fragment.

```ts
import { Component, signal } from '@angular/core';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';

@Component({
  selector: 'demo-image-url',
  imports: [PocketBaseImageUrlPipe],
  template: `
    <!-- Outputs 'collectionId/id/filename' -->
    <img [src]="source() | pocketBaseImageUrl: image()" />
  `,
})
export class DemoImageUrlComponent {
  source = signal({ id: '123', collectionId: 'abc' });
  image = signal('photo.jpg');
}
```

## Running unit tests

Run `nx test eco-store-shared-utils` to execute the unit tests via Vitest.
