import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { ECO_ADMIN_PLATFORM_NAV, ECO_ADMIN_TENANT_NAV } from '@plastik/eco-admin/layout-config';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { mockEcoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context/testing';
import { of } from 'rxjs';

import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  let harness: RouterTestingHarness;

  const signIn = (role: PocketBaseUserRoles): void => {
    mockPocketBaseUserProfileStore.user.set({
      id: 'user-1',
      name: 'Marta Puig',
      role,
    } as PocketBaseUser);
    mockPocketBaseUserProfileStore.isAuthenticated.set(true);
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(role === 'GLOBAL_ADMIN');
  };

  const landOn = async (url: string): Promise<string> => {
    await harness.navigateByUrl(url);

    return TestBed.inject(Router).url;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        provideTranslateService(),
        {
          provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
          useValue: { languages: ['ca', 'es'], defaultLanguage: 'ca' },
        },
        {
          provide: pocketBaseUserProfileStore,
          useValue: { ...mockPocketBaseUserProfileStore, updateLanguage: vi.fn() },
        },
        { provide: ecoAdminTenantContextStore, useValue: mockEcoAdminTenantContextStore },
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: true, breakpoints: {} }) },
        },
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.user.set(null);
    mockPocketBaseUserProfileStore.isAuthenticated.set(false);
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(false);
  });

  it('sends a tenant administrator from the root to the dashboard', async () => {
    signIn('TENANT_ADMIN');

    expect(await landOn('/')).toBe('/tauler');
  });

  it('sends a global administrator from the root to the cooperatives', async () => {
    signIn('GLOBAL_ADMIN');

    expect(await landOn('/')).toBe('/cooperatives');
  });

  it("sends each role back to its own home from the other role's sections", async () => {
    signIn('TENANT_ADMIN');
    expect(await landOn('/cooperatives')).toBe('/tauler');

    signIn('GLOBAL_ADMIN');
    expect(await landOn('/socis')).toBe('/cooperatives');
  });

  it('sends an unknown path to the home of the role', async () => {
    signIn('TENANT_ADMIN');

    expect(await landOn('/no-existeix')).toBe('/tauler');
  });

  it.each(ECO_ADMIN_TENANT_NAV.map(entry => [entry.path, entry.labelKey]))(
    'opens /%s for a tenant administrator, inside the shell, on the provisional view',
    async (path, labelKey) => {
      signIn('TENANT_ADMIN');

      expect(await landOn(`/${path}`)).toBe(`/${path}`);

      const shell = harness.routeNativeElement;

      expect(shell?.tagName.toLowerCase()).toBe('eco-admin-layout');
      expect(shell?.querySelector('main eco-admin-provisional-view h1')?.textContent).toContain(
        labelKey
      );
    }
  );

  it.each(ECO_ADMIN_PLATFORM_NAV.map(entry => entry.path))(
    'opens /%s for a global administrator',
    async path => {
      signIn('GLOBAL_ADMIN');

      expect(await landOn(`/${path}`)).toBe(`/${path}`);
    }
  );

  it('checks the session again when moving between sections, and sends an expired one to the login', async () => {
    signIn('TENANT_ADMIN');
    await landOn('/tauler');
    mockPocketBaseUserProfileStore.checkAuth.mockClear();
    mockEcoAdminTenantContextStore.load.mockClear();

    expect(await landOn('/socis')).toBe('/socis');
    expect(mockPocketBaseUserProfileStore.checkAuth).toHaveBeenCalled();
    expect(mockEcoAdminTenantContextStore.load).toHaveBeenCalled();

    mockPocketBaseUserProfileStore.isAuthenticated.set(false);

    expect(await landOn('/comandes')).toBe('/accedir?returnUrl=%2Fcomandes');
  });

  it('keeps the path of a deep link opened without a session', async () => {
    expect(await landOn('/socis')).toBe('/accedir?returnUrl=%2Fsocis');
  });

  it('titles each section with the label of its rail entry', async () => {
    signIn('TENANT_ADMIN');
    await landOn('/socis');

    const title = TestBed.inject(Router).routerState.snapshot.root.firstChild?.firstChild?.title;

    expect(title).toBe('shell.nav.socis');
  });
});
