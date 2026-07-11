import { PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, UrlTree } from '@angular/router';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { emptyCartGuard } from './empty-cart.guard';

interface CartStub {
  isEmpty: boolean;
  isSynced: boolean;
  isSyncing: boolean;
}

/**
 * Configures TestBed with a stubbed cart store, platform, and router for the guard under test.
 * @param {'server' | 'browser'} platform - Runtime to simulate, SSR or the client.
 * @param {CartStub} cart - Cart signal values the stub should expose to the guard.
 */
function configure(platform: 'server' | 'browser', cart: CartStub): void {
  const storeStub = {
    isEmpty: signal(cart.isEmpty),
    isSynced: signal(cart.isSynced),
    isSyncing: signal(cart.isSyncing),
  };

  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: PLATFORM_ID, useValue: platform },
      { provide: ecoStoreCartStore, useValue: storeStub },
    ],
  });
}

/**
 * Runs the guard inside an injection context and resolves its (possibly observable) result.
 * @returns {Promise<boolean | UrlTree>} The guard decision, true to allow or a redirect UrlTree.
 */
async function runGuard(): Promise<boolean | UrlTree> {
  const result = TestBed.runInInjectionContext(() =>
    (emptyCartGuard as CanActivateFn)({} as never, {} as never)
  );
  return firstValueFrom(isObservable(result) ? result : of(result)) as Promise<boolean | UrlTree>;
}

describe('emptyCartGuard', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('does NOT redirect to /botiga on the server, even when the cart reads empty (BUG-002: cart state is unknowable during SSR — no localStorage, no auth token)', async () => {
    configure('server', { isEmpty: true, isSynced: false, isSyncing: false });

    const result = await runGuard();

    expect(result).toBe(true);
  });

  it('redirects to /botiga in the browser when the cart is genuinely empty', async () => {
    configure('browser', { isEmpty: true, isSynced: false, isSyncing: false });

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/botiga');
  });

  it('allows activation in the browser when the cart has items', async () => {
    configure('browser', { isEmpty: false, isSynced: false, isSyncing: false });

    const result = await runGuard();

    expect(result).toBe(true);
  });
});
