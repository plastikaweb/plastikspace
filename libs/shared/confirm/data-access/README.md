# @plastik/shared/confirm/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [Description](#description)
- [How to use](#how-to-use)
- [Running unit tests](#running-unit-tests)
- [Resources](#resources)

## Description

This is a simple **confirm dialog component** that can be used to confirm an action. The most usual use case is to confirm a delete action.

## How to use

Inject the `SharedConfirmDialogService` in your component, service or configuration file and call the `confirm` method.
This method returns an observable that emits a boolean value. If the user clicks on the confirm button, the observable emits `true`, otherwise it emits `false`.

```typescript
  private confirmService = inject(SharedConfirmDialogService);

  this.confirmService.confirm({
    title: 'Delete',
    message: 'Are you sure you want to delete this item?',
    ko: 'Cancel',
    ok: 'Delete',
  })
  .pipe(take(1), filter(Boolean))
  .subscribe((result) => {
    if (result) {
      // do the delete action or whatever you want to do.
    }
  });
```

## Running unit tests

Run `nx test shared-confirm-data-access` to execute the unit tests.

## Resources

- [Angular Material Dialog](https://material.angular.io/components/dialog/overview)
