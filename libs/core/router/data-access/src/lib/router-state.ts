import { InjectionToken, Injector } from '@angular/core';

const ROUTER_STATE_FEATURE_KEY = new InjectionToken<string>('ROUTER_STATE_FEATURE_KEY');
const injector = Injector.create({ providers: [{ provide: ROUTER_STATE_FEATURE_KEY, useValue: 'router' }] });
export const routerKey = injector.get(ROUTER_STATE_FEATURE_KEY);
