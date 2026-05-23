# @plastik/eco-store/shared/tokens

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/shared/tokens](#plastikeco-storesharedtokens)
  - [Description](#description)
  - [Tokens](#tokens)
  - [Usage Examples](#usage-examples)
    - [1) Injecting the default category icon](#1-injecting-the-default-category-icon)
    - [2) Overriding the default category icon](#2-overriding-the-default-category-icon)

## Description

**Shared Tokens** provides Angular DI tokens for cross-cutting concerns in the Eco-Store application. These tokens enable consistent configuration and dependency injection across features and libraries.

## Tokens

```typescript
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';
```

- `ALL_PRODUCTS_ICON`: Injection token for the default category icon name.
  - Default value: `'storefront'`
  - Used when displaying "All Products" or when no category is selected.

## Usage Examples

### 1) Injecting the default category icon

```typescript
import { Component, inject } from '@angular/core';
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';

@Component({
  selector: 'eco-category-header',
  template: `<mat-icon>{{ iconName() }}</mat-icon>`,
})
export class CategoryHeaderComponent {
  readonly iconName = inject(ALL_PRODUCTS_ICON);
}
```

### 2) Overriding the default category icon

You can override the default value by providing a custom value in your application or module configuration:

```typescript
import { ApplicationConfig } from '@angular/core';
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ALL_PRODUCTS_ICON,
      useValue: 'shopping_cart',
    },
  ],
};
```
