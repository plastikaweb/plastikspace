# @plastik/core/can-deactivate-guard

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/can-deactivate-guard](#plastikcorecan-deactivate-guard)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [1. Implementing the Guard](#1-implementing-the-guard)
    - [2. Form Integration](#2-form-integration)
    - [3. Example Implementation](#3-example-implementation)
    - [4. Route Configuration](#4-route-configuration)
  - [How it Works](#how-it-works)
  - [Best Practices](#best-practices)

## Description

**Can Deactivate Guard** is an Angular route guard that prevents navigation when there are pending changes in a form or component.

## Features

- **Change Tracking**: Tracks pending changes in forms and components.
- **User Confirmation**: Prompts user confirmation before navigation when changes are unsaved.
- **Integration**: Integrates with shared form components and detail views.
- **Type Safety**: Fully typed implementation using TypeScript.

## Usage

### 1. Implementing the Guard

Components that need deactivation protection should implement the `CanDeactivateComponent` interface:

```typescript
export interface CanDeactivateComponent {
  pendingChanges: Signal<boolean>;
}
```

### 2. Form Integration

The shared form component (`plastik-shared-form-feature`) emits pending changes status through:

```typescript
pendingChangesEvent = output<boolean>();
```

This event is triggered whenever the form's dirty state changes.

### 3. Example Implementation

```typescript
@Component({
  // ... component metadata
  template: `
    <plastik-shared-form-feature
      [fields]="fields"
      [model]="model"
      (pendingChangesEvent)="pendingChanges.set($event)"
      (changeEvent)="onSubmit($event)">
    </plastik-shared-form-feature>
  `,
})
export class DetailItemFormComponent implements CanDeactivateComponent {
  pendingChanges = signal(false);

  onSubmit(data: object): void {}
}
```

### 4. Route Configuration

Add the guard to your routes:

```typescript
{
  path: 'detail',
  component: DetailComponent,
  canDeactivate: [canDeactivateGuard]
}
```

## How it Works

1. The guard checks the component's `pendingChanges` signal before allowing navigation.
2. If `pendingChanges` is true, it prompts the user for confirmation.
3. Form components emit their dirty state through `pendingChangesEvent`.
4. Parent components track these changes using the `pendingChanges` signal.
5. On successful form submission, `pendingChanges` is set to false.

## Best Practices

- Always reset `pendingChanges` to `false` after successful form submission.
- Use the `pendingChangesEvent` to track form changes instead of manual tracking.
- Implement the `CanDeactivateComponent` interface in components that need navigation protection.
