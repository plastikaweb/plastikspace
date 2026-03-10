# @plastik/shared/notification/ui/hot-toast

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/notification/ui/hot-toast](#plastiksharednotificationuihot-toast)
  - [Description](#description)
  - [Features](#features)
  - [How to use](#how-to-use)
  - [Styles](#styles)
  - [Running unit tests](#running-unit-tests)

## Description

A notification UI library built on top of `@ngxpert/hot-toast`, providing a modern, signal-based interface for displaying toast notifications in Angular applications.

## Features

- **Signal-based Inputs**: Uses Angular's modern `input()` and `computed()` APIs.
- **Customizable**: Supports custom templates and images for notifications.
- **Global Configuration Integration**: Merges local notification data with global type and position configurations via DI tokens.
- **Accessible & Responsive**: Inherits the robustness of `hot-toast` with custom styling.

## How to use

Include the component in your layout or app root and pass a notification signal.

```typescript
import { SharedNotificationUiHotToastComponent } from '@plastik/shared/notification/ui/hot-toast';

@Component({
  selector: 'app-root',
  imports: [SharedNotificationUiHotToastComponent],
  template: ` <plastik-shared-notification-ui-hot-toast [notification]="notification()" /> `,
})
export class AppComponent {
  notification = inject(NotificationStore).configuration;
}
```

## Styles

The library includes custom SCSS for styling the toasts. Ensure you import `@plastik/shared/notification/ui/hot-toast/style` in your global styles if needed, or check the integration in `eco-store`.

## Running unit tests

Run `nx test shared-notification-ui-hot-toast` to execute the unit tests via [Vitest](https://vitest.dev).
