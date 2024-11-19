# shared-activity-data-access

- [shared-activity-data-access](#shared-activity-data-access)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

This library contains the data access layer for the activity feature.

## How to use

- Import the Module.
  Import the `SharedActivityDataAccessModule` into your application's module or wherever you want to use it.

  ```typescript
  import { SharedActivityDataAccessModule } from '@plastik/shared/activity/data-access';

  @NgModule({
    imports: [SharedActivityDataAccessModule],
  })
  export class AppModule {}
  ```

- Dispatch Actions: Use the activityActions to dispatch actions to the store.

  ```typescript
  import { inject } from '@angular/core';
  import { Store } from '@ngrx/store';
  import { activityActions } from '@plastik/shared/activity/data-access';

  export class MyComponent implements OnInit {
    private readonly store = inject(Store);

    ngOnInit(): void {
      this.store.dispatch(activityActions.setActivity({ isActive: false }));
    }
  }
  ```

- Select State: Use the selectors to get the state from the store.

  ```typescript
  import { inject } from '@angular/core';
  import { Store } from '@ngrx/store';
  import { selectIsActive } from '@plastik/shared/activity/data-access';

  export class MyOtherComponent {
    private readonly store = inject(Store);

    isActive$ = this.store.select(selectIsActive);
  }
  ```

## Running unit tests

Run `nx test shared-activity-data-access` to execute the unit tests.
