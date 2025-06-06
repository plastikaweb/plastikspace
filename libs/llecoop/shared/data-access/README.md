# llecoop-shared-data-access

- [llecoop-shared-data-access](#llecoop-shared-data-access)
  - [Description](#description)
    - [LlecoopSharedCategoryFireService](#llecoopsharedcategoryfireservice)
      - [Features](#features)
      - [Usage Example](#usage-example)
      - [Running unit tests](#running-unit-tests)

## Description

This library provides data access services for shared functionality across the LleCoop application.

### LlecoopSharedCategoryFireService

It offers methods to retrieve category data from Firestore and format it for use in form select components.

#### Features

- Retrieves category data from Firestore
- Observable-based API
- Formatted select options for forms
- Used for optional filtering

#### Usage Example

```typescript
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { LlecoopSharedCategoryFireService } from '@plastik/llecoop/shared/data-access';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-product-form',
  template: `<!-- Your template here -->`,
})
export class ProductFormComponent {
  private categoryService = inject(LlecoopSharedCategoryFireService);

  getFormConfig(): FormlyFieldConfig[] {
    return [
      {
        key: 'category',
        type: 'select',
        props: {
          label: 'Category',
          placeholder: 'Select a category',
          required: true,
          // Get formatted select options with 'All' option
          options: this.categoryService.getCategoriesSelectData(),
        },
      },
      // For cases where you don't want the 'All' option
      {
        key: 'specificCategory',
        type: 'select',
        props: {
          label: 'Specific Category',
          placeholder: 'Select a specific category',
          required: true,
          // Get formatted select options without 'All' option
          options: this.categoryService.getCategoriesSelectData(false),
        },
      },
    ];
  }
}
```

#### Running unit tests

Run `nx test llecoop-shared-data-access` to execute the unit tests.
