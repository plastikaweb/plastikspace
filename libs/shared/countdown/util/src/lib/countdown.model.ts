import { Signal } from '@angular/core';

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownConfig {
  intervalMs?: number;
}

export interface Countdown {
  data: Signal<CountdownData | null>;
  text: Signal<string>;
  isExpired: Signal<boolean>;
}
