# shared-activity-data-access

- [shared-activity-data-access](#shared-activity-data-access)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

This library contains the data access layer for the activity feature. It uses NgRx Signals for efficient and straightforward state management.

## How to use

### 1. Provide the store in your application

Provide the `activityStore` in your application configuration:

```typescript
import { activityStore } from '@plastik/shared/activity/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    activityStore,
    // ...
  ],
};
```

### 2. Use the store in components

```typescript
import { Component, inject } from '@angular/core';
import { activityStore } from '@plastik/shared/activity/data-access';

@Component({
  selector: 'app-my-component',
  template: ` <div *ngIf="isActive()">Loading...</div> `,
})
export class MyComponent {
  private readonly store = inject(activityStore);

  // Access state as a signal
  readonly isActive = this.store.isActive;

  // Change the state
  setLoading(loading: boolean): void {
    this.store.setActivity(loading);
  }
}
```

### 3. In tests

For testing, you need to inject the store instance:

```typescript
import { TestBed } from '@angular/core/testing';
import { activityStore } from '@plastik/shared/activity/data-access';

describe('MyComponent', () => {
  let activityStoreInstance: unknown;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [activityStore],
    });

    activityStoreInstance = TestBed.inject(activityStore);
  });

  it('should set activity state', () => {
    // Mock the method for testing
    jest.spyOn(activityStoreInstance as any, 'setActivity');

    // Test it
    component.someMethod();
    expect(activityStoreInstance.setActivity).toHaveBeenCalledWith(true);
  });
});
```

## Running unit tests

Run `nx test shared-activity-data-access` to execute the unit tests.
