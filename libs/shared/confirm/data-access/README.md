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
This method returns an observable that emits a boolean value. If the user clicks the confirm button, the observable emits `true`, otherwise `false`.

### Signature

```typescript
confirm(
  title: string,
  message: string | SafeHtml,
  ko: string | { label: string; route: string[] } = 'Cancel',
  ok: string | { label: string; route: string[] } = 'Delete',
  params: Record<string, unknown> | null = null,
  icon: string | null = null
): Observable<boolean>
```

- `ko` / `ok` accept either a **translation key** string (closes the dialog) or a **route object** `{ label, route }` that navigates to the given route on click.
- `params` are optional translation interpolation parameters (passed to `ngx-translate`).
- `icon` is an optional Material icon name shown in the dialog header.

### Basic usage (delete dialog)

```typescript
private confirmService = inject(SharedConfirmDialogService);

this.confirmService.confirm(
  'confirm.delete.title',
  'confirm.delete.message',
  'confirm.delete.cancel',
  'confirm.delete.ok',
  { name: 'item name' } // optional params for translation
)
  .pipe(take(1), filter(Boolean))
  .subscribe(() => {
    // do the delete action
  });
```

### Usage with router CTA buttons

```typescript
this.confirmService.confirm(
  'cart.mergeNotification.title',
  'cart.mergeNotification.message',
  'cart.mergeNotification.ko',
  { label: 'cart.mergeNotification.ok', route: ['/cistella'] },
  null,
  'info'
);
```

## Running unit tests

Run `nx test shared-confirm-data-access` to execute the unit tests.

## Resources

- [Angular Material Dialog](https://material.angular.io/components/dialog/overview)
