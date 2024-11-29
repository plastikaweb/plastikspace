# llecoop-cms-layout

- [llecoop-cms-layout](#llecoop-cms-layout)
  - [Description](#description)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

`llecoop-cms-layout` is a library designed to manage CMS main layout for CMS layout for llecoop desktop app.

## Usage

Just load the `cms-layout-routes.ts` in the `app.routes.ts` file.

```typescript
// apps/llecoop/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    canActivate: [isLoggedGuard],
    loadChildren: () =>
      import('@plastik/llecoop/cms-layout').then(routes => routes.llecoopLayoutRoutes),
  },
];
```

## Running unit tests

Run `nx test cms-layout` to execute the unit tests.
