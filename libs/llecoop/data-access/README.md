# llecoop-category-data-access

- [llecoop-category-data-access](#llecoop-category-data-access)
  - [Description](#description)
  - [Features](#features)
  - [How to use](#how-to-use)
    - [Notification Service](#notification-service)
  - [Running unit tests](#running-unit-tests)

## Description

This library contains the data access logic for the llecoop application. It provides services and utilities to manage the application state and notifications.

## Features

- Centralized notification management.
- Integration with shared notification system.
- Support for different notification types.
- Configurable notification preservation.

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

## Running unit tests

Run `nx test llecoop-data-access` to execute the unit tests.
