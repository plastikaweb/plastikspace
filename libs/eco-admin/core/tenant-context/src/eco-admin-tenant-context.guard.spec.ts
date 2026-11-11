import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ecoAdminTenantContextGuard } from './eco-admin-tenant-context.guard';
import { ecoAdminTenantContextStore } from './eco-admin-tenant-context.store';
import { mockEcoAdminTenantContextStore } from './eco-admin-tenant-context.store.mock';

describe('ecoAdminTenantContextGuard', () => {
  /**
   * Runs the guard inside an injection context.
   * @returns {Promise<unknown>} What the guard resolved with.
   */
  function runGuard(): Promise<unknown> {
    return TestBed.runInInjectionContext(
      () =>
        ecoAdminTenantContextGuard(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        ) as Promise<unknown>
    );
  }

  beforeEach(() => {
    mockEcoAdminTenantContextStore.load.mockReset();
    TestBed.configureTestingModule({
      providers: [
        { provide: ecoAdminTenantContextStore, useValue: mockEcoAdminTenantContextStore },
      ],
    });
  });

  it('waits for the tenant context before it lets the navigation through', async () => {
    let settle!: () => void;
    let outcome: unknown = 'pending';

    mockEcoAdminTenantContextStore.load.mockReturnValueOnce(
      new Promise<void>(resolve => (settle = resolve))
    );
    const running = runGuard().then(result => (outcome = result));

    await Promise.resolve();

    expect(mockEcoAdminTenantContextStore.load).toHaveBeenCalledTimes(1);
    expect(outcome).toBe('pending');

    settle();
    await running;

    expect(outcome).toBe(true);
  });

  it('lets the navigation through whatever state the store ended in', async () => {
    mockEcoAdminTenantContextStore.load.mockResolvedValueOnce(undefined);
    mockEcoAdminTenantContextStore.status.set('error');

    await expect(runGuard()).resolves.toBe(true);
  });
});
