# @plastik/core/paginator

- [@plastik/core/paginator](#plastikcorepaginator)
  - [Description](#description)
  - [Usage](#usage)
    - [Application Setup](#application-setup)
    - [Required Translations](#required-translations)
  - [Features](#features)
  - [Useful links](#useful-links)

## Description

This library provides the `MatPaginatorIntlService` which extends Angular Material's `MatPaginatorIntl` to offer translated paginator labels using `@ngx-translate`.

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

## Features

- ✅ Automatic translation of all paginator labels
- ✅ Dynamic updates when language changes
- ✅ Support for custom languages via ngx-translate
- ✅ Automatic subscription management with `takeUntilDestroyed`

## Useful links

- [Angular Material Paginator](https://material.angular.io/components/paginator/overview)
- [ngx-translate](https://github.com/ngx-translate/core)
