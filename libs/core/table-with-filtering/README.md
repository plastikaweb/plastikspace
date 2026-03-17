# @plastik/core/table-with-filtering

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/table-with-filtering](#plastikcoretable-with-filtering)
  - [Description](#description)
  - [Usage](#usage)
    - [Route Setup](#route-setup)
    - [Tokens](#tokens)

## Description

A **Core Feature Component** that displays a table with advanced filtering capabilities. It orchestrates the interaction between a filtering form and a data table, powered by a specific Store.

## Usage

### Route Setup

Load the `TableWithFilteringComponent` in your route configuration and provide the necessary implementation tokens:

```typescript
import { Route } from '@angular/router';
import { TableWithFilteringComponent, TABLE_WITH_FILTERING_FACADE } from '@plastik/core/list-view';
import { FIREBASE_STORE_TOKEN, FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';

export const exampleFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Example Feature',
    component: TableWithFilteringComponent,
    providers: [
      // 1. Store Token (manages data state)
      {
        provide: FIREBASE_STORE_TOKEN,
        useExisting: ExampleStore,
      },
      // 2. Facade Token (connects view to data)
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: ExampleListFacadeService,
      },
      // 3. Table Configuration (columns, structure)
      {
        provide: TABLE_TOKEN,
        useExisting: ExampleTableConfigService,
      },
      // 4. Form Configuration (filters)
      {
        provide: FORM_TOKEN,
        useValue: getExampleSearchFormConfig(),
      },
    ],
  },
];
```

### Tokens

| Token                         | Interface                     | Purpose                                                          |
| :---------------------------- | :---------------------------- | :--------------------------------------------------------------- |
| `FIREBASE_STORE_TOKEN`        | `StoreFeatureToken`           | Configures the underlying data store (sorting, count, entities). |
| `TABLE_WITH_FILTERING_FACADE` | `TableWithFilteringFacade<T>` | Facade service exposing table data and structure signals.        |
| `TABLE_TOKEN`                 | `TableStructureConfig<T>`     | Defines the table columns and behavior.                          |
| `FORM_TOKEN`                  | `FormConfig<T>`               | Defines the Formly configuration for the filter form.            |
