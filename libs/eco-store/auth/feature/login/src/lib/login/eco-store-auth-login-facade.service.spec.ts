import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { loginFormConfig } from '@plastik/auth/config/util';
import { AUTH_LOGIN_ERRORS } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN, PocketBaseUser } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { activityStore } from '@plastik/shared/activity/data-access';

import { EcoStoreAuthLoginFacadeService } from './eco-store-auth-login-facade.service';

describe('EcoStoreAuthLoginFacadeService', () => {
  const credentials = { email: 'member@example.test', password: 'test-password' };
  const formConfig = loginFormConfig();
  const tenantId = mockEcoStoreTenantStore.tenant()?.id ?? '';
  const setActivity = vi.fn();
  let facade: EcoStoreAuthLoginFacadeService;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  /**
   * Makes the store double answer a login the way the real store does.
   * @param {string} outcome What the store reports.
   * @param {string | null} tenant The tenant of the user the store ends up holding, or null for no user.
   */
  function storeAnswers(outcome: string, tenant: string | null = null): void {
    mockPocketBaseUserProfileStore.login.mockImplementation(async () => {
      mockPocketBaseUserProfileStore.user.set(
        tenant === null ? null : ({ id: 'user-1', tenant } as PocketBaseUser)
      );
      mockPocketBaseUserProfileStore.isAuthenticated.set(tenant !== null);

      return outcome;
    });
  }

  /**
   * Builds the facade the way the route does.
   * @param {string} [returnUrl] The value of the `returnUrl` query parameter the visitor arrives with.
   */
  async function create(returnUrl?: string): Promise<void> {
    const router = TestBed.inject(Router);

    if (returnUrl !== undefined) {
      await router.navigateByUrl(`/?returnUrl=${encodeURIComponent(returnUrl)}`);
    }

    navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    facade = TestBed.inject(EcoStoreAuthLoginFacadeService);
  }

  beforeEach(() => {
    mockPocketBaseUserProfileStore.login.mockReset();
    mockPocketBaseUserProfileStore.logout.mockReset();
    mockPocketBaseUserProfileStore.cancelLoginChallenge.mockReset();
    mockPocketBaseUserProfileStore.user.set(null);
    mockPocketBaseUserProfileStore.isAuthenticated.set(false);
    mockPocketBaseUserProfileStore.isLoading.set(false);
    setActivity.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: FORM_TOKEN, useValue: formConfig },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: activityStore, useValue: { setActivity } },
      ],
    });
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.user.set(null);
    mockPocketBaseUserProfileStore.isAuthenticated.set(false);
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  describe('before an attempt', () => {
    beforeEach(() => create());

    it('starts with nothing to report', () => {
      expect(facade.isLoading()).toBe(false);
      expect(facade.error()).toBeNull();
    });

    it('takes its form from the route', () => {
      expect(facade.formConfig).toBe(formConfig);
    });

    it('tells the activity bar when a login runs', () => {
      TestBed.tick();

      expect(setActivity).toHaveBeenLastCalledWith(false, 'auth.login.loading');

      mockPocketBaseUserProfileStore.isLoading.set(true);
      TestBed.tick();

      expect(setActivity).toHaveBeenLastCalledWith(true, 'auth.login.loading');
    });
  });

  describe('an attempt that opens a session', () => {
    it('asks the store with the credentials as typed, and silences its toast', async () => {
      await create();
      storeAnswers('authenticated', tenantId);

      await facade.onSubmit(credentials);

      expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledWith(credentials, {
        notifyOnFailure: false,
      });
    });

    it('takes the member to the store, with nothing left on the screen', async () => {
      await create();
      storeAnswers('authenticated', tenantId);

      await facade.onSubmit(credentials);

      expect(navigateByUrl).toHaveBeenCalledWith('/');
      expect(facade.error()).toBeNull();
      expect(mockPocketBaseUserProfileStore.logout).not.toHaveBeenCalled();
    });

    it('takes the member back to where the guard stopped them', async () => {
      await create('/comandes/nova');
      storeAnswers('authenticated', tenantId);

      await facade.onSubmit(credentials);

      expect(navigateByUrl).toHaveBeenCalledWith('/comandes/nova');
    });

    it.each(['https://evil.example/steal', '//evil.example/steal', 'comandes'])(
      'does not follow a return address that leaves the store: %s',
      async returnUrl => {
        await create(returnUrl);
        storeAnswers('authenticated', tenantId);

        await facade.onSubmit(credentials);

        expect(navigateByUrl).toHaveBeenCalledWith('/');
      }
    );
  });

  describe('an attempt that fails', () => {
    beforeEach(() => create());

    it('says on the screen that the credentials are wrong, and stays there', async () => {
      storeAnswers('failed');

      await facade.onSubmit(credentials);

      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.wrong);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('says the same when the store answers something it does not know', async () => {
      storeAnswers('role-rejected');

      await facade.onSubmit(credentials);

      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.wrong);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('says the same when the store breaks, without rejecting', async () => {
      mockPocketBaseUserProfileStore.login.mockRejectedValue(new Error('network'));

      await expect(facade.onSubmit(credentials)).resolves.toBeUndefined();

      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.wrong);
    });

    it('closes the session of an account of another cooperative, with the text of a wrong password', async () => {
      storeAnswers('authenticated', 'another-tenant');

      await expect(facade.onSubmit(credentials)).resolves.toBeUndefined();

      expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.wrong);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('drops the pending login of an account that asks for a second step, and says so', async () => {
      storeAnswers('mfa-required');

      await facade.onSubmit(credentials);

      expect(mockPocketBaseUserProfileStore.cancelLoginChallenge).toHaveBeenCalledTimes(1);
      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.secondStep);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('the reason of a failed attempt', () => {
    beforeEach(async () => {
      await create();
      storeAnswers('failed');
      await facade.onSubmit(credentials);
    });

    it('goes away when asked to', () => {
      facade.clearError();

      expect(facade.error()).toBeNull();
    });

    it('stays while a login runs', () => {
      mockPocketBaseUserProfileStore.isLoading.set(true);

      facade.clearError();

      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.wrong);
    });

    it('is taken away while the next attempt runs and comes back with its answer', async () => {
      let finish: (outcome: string) => void = () => undefined;

      mockPocketBaseUserProfileStore.login.mockReturnValue(
        new Promise<string>(resolve => (finish = resolve))
      );

      const attempt = facade.onSubmit(credentials);

      expect(facade.error()).toBeNull();

      finish('failed');
      await attempt;

      expect(facade.error()).toBe(AUTH_LOGIN_ERRORS.wrong);
    });

    it('ignores an attempt made while another one runs', async () => {
      mockPocketBaseUserProfileStore.login.mockClear();
      mockPocketBaseUserProfileStore.isLoading.set(true);

      await facade.onSubmit(credentials);

      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });
  });
});
