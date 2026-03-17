# @plastik/core/paginator

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [Description](#description)
- [Features](#features)
- [Usage](#usage)
- [Resources](#resources)

## Description

The **Core Paginator** library provides the `MatPaginatorIntlService` which extends Angular Material's `MatPaginatorIntl` to offer translated paginator labels using `@ngx-translate`.

## Features

- ✅ Automatic translation of all paginator labels.
- ✅ Dynamic updates when language changes.
- ✅ Support for custom languages via ngx-translate.
- ✅ Automatic subscription management with `takeUntilDestroyed`.

## Usage

### Application Setup

In your application routes or providers file:

```typescript
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlService } from '@plastik/core/paginator';

export const appRoutes: Route[] = [
  {
    path: '',
    providers: [
      {
        provide: MatPaginatorIntl,
        useClass: MatPaginatorIntlService,
      },
    ],
    // ...
  },
];
```

### Required Translations

The service expects the following translation keys in your i18n files:

```json
{
  "paginator": {
    "items-per-page": "Items per page",
    "next-page": "Next page",
    "previous-page": "Previous page",
    "first-page": "First page",
    "last-page": "Last page",
    "no-items": "{{length}} items",
    "range": "{{start}} - {{end}} of {{total}}"
  }
}
```

## Resources

- [Angular Material Paginator](https://material.angular.io/components/paginator/overview)
- [ngx-translate](https://github.com/ngx-translate/core)
