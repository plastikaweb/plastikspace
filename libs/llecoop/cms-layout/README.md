# @plastik/llecoop/cms-layout

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/llecoop/cms-layout](#plastikllecoopcms-layout)
  - [Description](#description)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

**`llecoop-cms-layout`** is a library designed to manage the **main CMS layout** for the Llecoop desktop application.

## Usage

Lazy load the `cms-layout-routes.ts` in the `app.routes.ts` file.

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
