# shared-util-formatters

- [shared-util-formatters](#shared-util-formatters)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A shared library to format data.

## How to use

- Import the `SharedUtilFormattersModule` into the library or main module that needs formatting.

```typescript
import { SharedUtilFormattersModule } from '@plastik/shared/formatters';

@NgModule({
  imports: [
    SharedUtilFormattersModule,
    // other imports...
  ],
})
export class FeatureModule {}
```

- Optional: You can extend the `DataFormatFactoryService<T>` with the generic type data for the feature library case.

```typescript
import { Injectable } from '@angular/core';
import { DataFormatFactoryService } from '@plastik/shared/formatters';

@Injectable()
export class FeatureFormatFactoryService<
  T extends Record<string, keyof T>,
> extends DataFormatFactoryService<T> {}
```

- Use the `SafeFormattedPipe` in your feature template to format the passed input value and PropertyFormatting configuration.

```typescript
const descriptionFormatting: PropertyFormatting<Item, TEXT> = {
  key: 'description',
  title: 'Description',
  pathToKey: 'description',
  cssClasses: 'min-w-[9rem] 2xl:min-w-[24rem]',
  formatting: {
    type: TEXT,
  },
};
```

```html
<div [innerHTML]="item | safeFormatted : descriptionFormatting"></div>
```

## Running unit tests

Run `nx test shared-util-formatters` to execute the unit tests.
