import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { ecoStoreProductCanDeactivateGuard } from './eco-store-product-can-deactivate.guard';

describe('ecoStoreProductCanDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn<{ pendingChanges: () => boolean }> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => ecoStoreProductCanDeactivateGuard(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
