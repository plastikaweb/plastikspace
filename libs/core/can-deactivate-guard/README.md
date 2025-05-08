# Can Deactivate Guard

- [Can Deactivate Guard](#can-deactivate-guard)
  - [Features](#features)
  - [Usage](#usage)
    - [1. Implementing the Guard](#1-implementing-the-guard)
    - [2. Form Integration](#2-form-integration)
    - [3. Example Implementation](#3-example-implementation)
    - [4. Route Configuration](#4-route-configuration)
  - [How it Works](#how-it-works)
  - [Best Practices](#best-practices)
  - [Running unit tests](#running-unit-tests)

Angular route guard that prevents navigation when there are pending changes in a form or component.

## Features

- Tracks pending changes in forms and components
- Prompts user confirmation before navigation when changes are unsaved
- Integrates with shared form components and detail views
- Type-safe implementation using TypeScript

## Usage

### 1. Implementing the Guard

Components that need deactivation protection should implement the `CanDeactivateComponent` interface:

```typescript
export interface CanDeactivateComponent {
  pendingChanges: Signal<boolean>;
}
```

### 2. Form Integration

The shared form component (`plastik-shared-form-feature`) now emits pending changes status through:

```typescript
pendingChangesEvent = output<boolean>();
```

This event is triggered whenever the form's dirty state changes, allowing parent components to track unsaved changes.

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

1. The guard checks the component's `pendingChanges` signal before allowing navigation
2. If `pendingChanges` is true, it prompts the user for confirmation
3. Form components emit their dirty state through `pendingChangesEvent`
4. Parent components track these changes using the `pendingChanges` signal
5. On successful form submission, `pendingChanges` is set to false

## Best Practices

1. Always reset `pendingChanges` to false after successful form submission
2. Use the `pendingChangesEvent` to track form changes instead of manual tracking
3. Implement the `CanDeactivateComponent` interface in components that need navigation protection

## Running unit tests

Run `nx test can-deactivate-guard` to execute the unit tests.
