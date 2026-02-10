# @plastik/shared/countdown/util

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)

- [@plastik/shared/countdown/util](#plastiksharedcountdownutil)
  - [Description](#description)
  - [Features](#features)
  - [API](#api)
    - [`CountdownService`](#countdownservice)
      - [`createCountdown(targetDateFn: () => Date | null, config?: CountdownConfig): Countdown`](#createcountdowntargetdatefn---date--null-config-countdownconfig-countdown)
      - [Returns `Countdown` interface](#returns-countdown-interface)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A lightweight, reactive utility library for creating countdown timers in Angular applications using Signals.

## Features

- **Reactive Signals**: Built entirely with Angular Signals for fine-grained reactivity.
- **Optimized Performance**: The underlying interval only runs when a countdown is active, stopping automatically when the target date is reached or removed.
- **Flexible Configuration**: Customizable update interval and format.
- **Dependency Free**: Relies only on Angular Core and RxJS.

## API

### `CountdownService`

#### `createCountdown(targetDateFn: () => Date | null, config?: CountdownConfig): Countdown`

Creates a reactive countdown.

- **targetDateFn**: A function (usually a Signal getter) that returns the target `Date` object or `null`. If `null` or in the past, the countdown stops.
- **config**: Optional configuration object.
  - `intervalMs`: The update frequency in milliseconds (default: `1000`).

#### Returns `Countdown` interface

```typescript
interface Countdown {
  data: Signal<CountdownData | null>; // { days, hours, minutes, seconds }
  text: Signal<string>; // Formatted string "Xd Xh Xm Xs"
  isExpired: Signal<boolean>; // True if target date is in the past
}
```

## How to use

Inject the `CountdownService` and use `createCountdown` to generate a reactive countdown object.

```typescript
import { Component, inject } from '@angular/core';
import { CountdownService } from '@plastik/shared/countdown/util';

@Component({ ... })
export class MyComponent {
  private countdownService = inject(CountdownService);

  // Define a signal or function that returns the target Date
  targetDate = signal<Date>(new Date('2024-12-31T23:59:59'));

  // Create the countdown
  countdown = this.countdownService.createCountdown(
    () => this.targetDate(),
    { intervalMs: 1000 }
  );

  // Access the signals
  // this.countdown.text()      -> "5d 2h 30m 15s"
  // this.countdown.isExpired() -> false
  // this.countdown.data()      -> { days: 5, hours: 2, minutes: 30, seconds: 15 }
}
```

## Running unit tests

Run `nx test shared-countdown-util` to execute the unit tests.
