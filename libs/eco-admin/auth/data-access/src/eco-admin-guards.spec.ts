import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';

import { ecoAdminAnonymousGuard } from './eco-admin-anonymous.guard';
import { ecoAdminSessionGuard } from './eco-admin-session.guard';

describe('eco-admin session guards', () => {
  /**
   * Puts a session of the given role in the store double, or none at all.
   * @param {PocketBaseUserRoles | null} role The role of the signed-in user, or null for a visitor.
   */
  function signInAs(role: PocketBaseUserRoles | null): void {
    mockPocketBaseUserProfileStore.isAuthenticated.set(role !== null);
    mockPocketBaseUserProfileStore.user.set(
      role === null ? null : ({ id: 'user-1', role } as PocketBaseUser)
    );
  }

  /**
   * Runs the guard of the application routes.
   * @param {string} url The address the navigation is heading to.
   * @returns {unknown} What the guard answered.
   */
  function runSessionGuard(url = '/'): unknown {
    return TestBed.runInInjectionContext(() =>
      ecoAdminSessionGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot)
    );
  }

  /**
   * Runs the guard of the login screen.
   * @returns {unknown} What the guard answered.
   */
  function runAnonymousGuard(): unknown {
    return TestBed.runInInjectionContext(() =>
      ecoAdminAnonymousGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  /**
   * Serialises a redirect so it can be compared as text.
   * @param {unknown} outcome What a guard answered.
   * @returns {string} The address of the redirect.
   */
  function redirectOf(outcome: unknown): string {
    expect(outcome).toBeInstanceOf(UrlTree);

    return TestBed.inject(Router).serializeUrl(outcome as UrlTree);
  }

  beforeEach(() => {
    mockPocketBaseUserProfileStore.logout.mockReset();
    mockPocketBaseUserProfileStore.checkAuth.mockReset();
    // Like the real store, closing the session empties the state the guards read next.
    mockPocketBaseUserProfileStore.logout.mockImplementation(() => signInAs(null));
    signInAs(null);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    });
  });

  describe('ecoAdminSessionGuard', () => {
    it('re-reads the stored session before it decides', () => {
      runSessionGuard();

      expect(mockPocketBaseUserProfileStore.checkAuth).toHaveBeenCalledTimes(1);
    });

    it('sends a visitor to the login screen', () => {
      expect(redirectOf(runSessionGuard('/'))).toBe('/accedir');
      expect(mockPocketBaseUserProfileStore.logout).not.toHaveBeenCalled();
    });

    it('keeps the address a visitor asked for', () => {
      expect(redirectOf(runSessionGuard('/socis?estat=actiu'))).toBe(
        '/accedir?returnUrl=%2Fsocis%3Festat%3Dactiu'
      );
    });

    it.each<PocketBaseUserRoles>(['TENANT_ADMIN', 'GLOBAL_ADMIN'])('lets a %s through', role => {
      signInAs(role);

      expect(runSessionGuard('/socis')).toBe(true);
      expect(mockPocketBaseUserProfileStore.logout).not.toHaveBeenCalled();
    });

    it('closes the session of a storefront member before it redirects', () => {
      signInAs('PARTNER');

      expect(redirectOf(runSessionGuard('/socis'))).toBe('/accedir');
      expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('ecoAdminAnonymousGuard', () => {
    it('shows the login screen to a visitor', () => {
      expect(runAnonymousGuard()).toBe(true);
      expect(mockPocketBaseUserProfileStore.checkAuth).toHaveBeenCalledTimes(1);
      expect(mockPocketBaseUserProfileStore.logout).not.toHaveBeenCalled();
    });

    it('sends a tenant administrator to the dashboard', () => {
      signInAs('TENANT_ADMIN');

      expect(redirectOf(runAnonymousGuard())).toBe('/tauler');
    });

    it('sends a global administrator to the tenant list', () => {
      signInAs('GLOBAL_ADMIN');

      expect(redirectOf(runAnonymousGuard())).toBe('/cooperatives');
    });

    it('closes the session of a storefront member and shows the login screen', () => {
      signInAs('PARTNER');

      expect(runAnonymousGuard()).toBe(true);
      expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
    });
  });

  it('never bounces a storefront member between the two routes', () => {
    signInAs('PARTNER');

    // First stop: the application route closes the session and points at the login screen.
    expect(redirectOf(runSessionGuard('/'))).toBe('/accedir');
    // Second stop: the login screen finds no session left and stays put.
    expect(runAnonymousGuard()).toBe(true);
    expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
  });
});
