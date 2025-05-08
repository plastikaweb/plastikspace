import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { canDeactivateGuard } from './can-deactivate.guard';

describe('CanDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn<{ pendingChanges: () => boolean }> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => canDeactivateGuard(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
