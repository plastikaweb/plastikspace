import { InjectionToken } from '@angular/core';
import { SignalState } from '@ngrx/signals';
import { BaseEntity } from './base-entity';

export const STORE_TOKEN = new InjectionToken<SignalState<BaseEntity>>('STORE_TOKEN');
