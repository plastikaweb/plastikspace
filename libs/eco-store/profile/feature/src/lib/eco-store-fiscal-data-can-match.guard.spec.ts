import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanMatchFn, provideRouter } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { beforeEach, describe, expect, it } from 'vitest';
import { ecoStoreFiscalDataCanMatchGuard } from './eco-store-fiscal-data-can-match.guard';

/**
 * Configures TestBed with a stubbed tenant store exposing the given fiscal data flag.
 * @param {boolean | null} fiscalDataEnabled - Fiscal data flag the stub tenant should carry, or
 *   `null` to simulate no tenant loaded yet.
 */
function configure(fiscalDataEnabled: boolean | null): void {
  const storeStub = {
    tenant: signal(fiscalDataEnabled === null ? null : { fiscalDataEnabled }),
  };

  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ecoStoreTenantStore, useValue: storeStub }],
  });
}

/**
 * Runs the guard inside an injection context and resolves its decision.
 * @returns {boolean} Whether the route may match.
 */
function runGuard(): boolean {
  return TestBed.runInInjectionContext(() =>
    (ecoStoreFiscalDataCanMatchGuard as CanMatchFn)({} as never, [])
  ) as boolean;
}

describe('ecoStoreFiscalDataCanMatchGuard', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('matches when the tenant has fiscal data capture enabled', () => {
    configure(true);

    expect(runGuard()).toBe(true);
  });

  it('does not match when the tenant has fiscal data capture disabled', () => {
    configure(false);

    expect(runGuard()).toBe(false);
  });

  it('does not match when there is no tenant loaded yet', () => {
    configure(null);

    expect(runGuard()).toBe(false);
  });
});
