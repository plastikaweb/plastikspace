# llecoop-data-access

- [llecoop-data-access](#llecoop-data-access)
  - [Description](#description)
  - [Features](#features)
  - [How to use](#how-to-use)
    - [Notification Service](#notification-service)
    - [STORE_TOKEN](#store_token)
  - [Running unit tests](#running-unit-tests)

## Description

This library contains the data access logic for the llecoop application. It provides services and utilities to manage the application state and notifications.

## Features

- Centralized notification management.
- Integration with shared notification system.
- Support for different notification types.
- Configurable notification preservation.
- STORE_TOKEN for providing a basic store feature.

## How to use

### Notification Service

```typescript
// Inject the service
constructor(private storeNotificationService: StoreNotificationService) {}

// Create a notification
this.storeNotificationService.create(
  'Notification message',
  NotificationType.Success, // or Error, Warning, Info
  true // preserve: optional, defaults to true
);
```

### STORE_TOKEN

This token provides a basic store feature to provide a store for a feature route.

```typescript
// feature.routes.ts
export const FeatureRoutes: Route[] = [
  {
    path: 'feature',
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: FeatureStore,
      },
    ],
  },
];
```

## Running unit tests

Run `nx test llecoop-data-access` to execute the unit tests.
