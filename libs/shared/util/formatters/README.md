# shared-utils-formatters

- [shared-utils-formatters](#shared-utils-formatters)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A shared library to format data.

## How to use

- Import the `SharedUtilsFormattersModule` into the library or main module that needs formatting.

```typescript
import { SharedUtilsFormattersModule } from '@tvav/shared/utils/formatters';

@NgModule({
  imports: [
    SharedUtilsFormattersModule,
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
export class FeatureFormatFactoryService<T extends Record<string, keyof T>> extends DataFormatFactoryService<T> {}
```

- Use the `SafeFormattedPipe` in your feature template to format the passed input value and PropertyFormatting configuration.

```typescript
const descriptionFormatting: PropertyFormatting<Item, FormattingTypes.TEXT> = {
  key: 'description',
  title: 'Description',
  propertyPath: 'description',
  cssClasses: 'min-w-[9rem] 2xl:min-w-[24rem]',
  formatting: {
    type: FormattingTypes.TEXT,
  },
};
```

```html
<div [innerHTML]="item | safeFormatted : descriptionFormatting"></div>
```

## Running unit tests

Run `nx test shared-utils-formatters` to execute the unit tests.
