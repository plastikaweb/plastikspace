import { InjectionToken } from '@angular/core';
import PocketBase from 'pocketbase';

export const POCKETBASE_INSTANCE = new InjectionToken<PocketBase>('PocketBase');
