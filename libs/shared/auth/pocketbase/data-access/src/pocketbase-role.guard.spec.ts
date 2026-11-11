import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { PocketBaseUserRoles } from '@plastik/core/entities';

import { pocketBaseRoleGuard, PocketBaseRoleGuardOptions } from './pocketbase-role.guard';
import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

/**
 * Runs the role guard for admin roles against a stubbed profile store.
 * @param {PocketBaseUserRoles | null} role The role of the signed-in user, or null when there is no session.
 * @param {PocketBaseRoleGuardOptions} [options] The redirect options handed to the guard.
 * @returns {boolean | UrlTree} The guard decision, true to allow or a redirect UrlTree.
 */
function runGuard(
  role: PocketBaseUserRoles | null,
  options?: PocketBaseRoleGuardOptions
): boolean | UrlTree {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: pocketBaseUserProfileStore,
        useValue: {
          isAuthenticated: signal(role !== null),
          user: signal(role ? { role } : null),
        },
      },
    ],
  });

  const guard = pocketBaseRoleGuard(['TENANT_ADMIN', 'GLOBAL_ADMIN'], options);

  return TestBed.runInInjectionContext(() => guard({} as never, {} as never)) as boolean | UrlTree;
}

describe('pocketBaseRoleGuard', () => {
  it('lets a signed-in user with an allowed role through', () => {
    expect(runGuard('TENANT_ADMIN')).toBe(true);
    TestBed.resetTestingModule();
    expect(runGuard('GLOBAL_ADMIN')).toBe(true);
  });

  it('sends a visitor with no session to the default login url', () => {
    expect(String(runGuard(null))).toBe('/accedir');
  });

  it('sends a visitor with no session to the given login url', () => {
    expect(String(runGuard(null, { loginUrl: '/login' }))).toBe('/login');
  });

  it('sends a signed-in user with a role outside the list to the default redirect', () => {
    expect(String(runGuard('PARTNER'))).toBe('/');
  });

  it('sends a signed-in user with a role outside the list to the given redirect', () => {
    expect(String(runGuard('PARTNER', { redirectTo: '/sense-acces' }))).toBe('/sense-acces');
  });
});
