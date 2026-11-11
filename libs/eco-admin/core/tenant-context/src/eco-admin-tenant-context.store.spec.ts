import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import type { PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';
import type { EcoStoreTenant } from '@plastik/eco/entities';
import { ecoAdminTenantContextStore } from './eco-admin-tenant-context.store';

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

/**
 * Builds a promise whose outcome the test decides later.
 * @template T
 * @returns {Deferred<T>} The promise with its resolve and reject handles.
 */
function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Builds a user record with only the fields the store reads.
 * @param {PocketBaseUserRoles} role The user's role.
 * @param {string} tenant The id of the tenant on the user record.
 * @param {string} [id] The user id.
 * @returns {PocketBaseUser} The user record.
 */
function userOf(role: PocketBaseUserRoles, tenant: string, id = 'user-1'): PocketBaseUser {
  return { id, role, tenant, name: 'Test user' } as PocketBaseUser;
}

/**
 * Builds a tenant record with only the fields the store reads.
 * @param {string} id The tenant id.
 * @param {object} [overrides] Fields to set on top of the windowed default.
 * @returns {EcoStoreTenant} The tenant record.
 */
function tenantOf(id: string, overrides: object = {}): EcoStoreTenant {
  return {
    id,
    name: `Cooperative ${id}`,
    logisticsConfig: { orderWindow: { enabled: true } },
    ...overrides,
  } as EcoStoreTenant;
}

const CONTINUOUS = { logisticsConfig: { orderWindow: { enabled: false } } };

describe('ecoAdminTenantContextStore', () => {
  const getOne = vi.fn();
  const getList = vi.fn();
  const filter = vi.fn((raw: string, params: Record<string, string>) =>
    raw.replace('{:tenantId}', `'${params['tenantId']}'`)
  );
  const collection = vi.fn((name: string) => (name === 'tenants' ? { getOne } : { getList }));

  /**
   * Configures the testing module, injects the store and runs its session effect once.
   * @param {PocketBaseUser | null} initialUser The user of the restored session, or null for none.
   * @returns {object} The store and the writable user signal that stands for the session.
   */
  function setup(initialUser: PocketBaseUser | null) {
    const user = signal<PocketBaseUser | null>(initialUser);
    const profile = {
      user,
      isTenantAdmin: computed(() => user()?.role === 'TENANT_ADMIN'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: POCKETBASE_INSTANCE, useValue: { collection, filter } },
        { provide: pocketBaseUserProfileStore, useValue: profile },
      ],
    });

    const store = TestBed.inject(ecoAdminTenantContextStore);

    TestBed.tick();

    return { store, user };
  }

  beforeEach(() => {
    getOne.mockReset();
    getList.mockReset();
    filter.mockClear();
    collection.mockClear();
  });

  describe('following the session', () => {
    it('loads the tenant of a tenant administrator whose session was restored', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', { shortName: 'Llevat' }));
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      expect(store.status()).toBe('loading');
      await store.load();

      expect(getOne).toHaveBeenCalledTimes(1);
      expect(getOne).toHaveBeenCalledWith('tenant-a', { requestKey: null });
      expect(store.status()).toBe('loaded');
      expect(store.tenantId()).toBe('tenant-a');
      expect(store.hasTenant()).toBe(true);
      expect(store.tenant()?.id).toBe('tenant-a');
      expect(store.tenantName()).toBe('Llevat');
    });

    it('requests nothing for a global administrator, although their record carries a tenant', async () => {
      const { store } = setup(userOf('GLOBAL_ADMIN', 'tenant-a'));

      await store.load();

      expect(collection).not.toHaveBeenCalled();
      expect(store.tenantId()).toBeNull();
      expect(store.hasTenant()).toBe(false);
      expect(store.status()).toBe('idle');
    });

    it('requests nothing without a session', async () => {
      const { store } = setup(null);

      await store.load();

      expect(collection).not.toHaveBeenCalled();
      expect(store.status()).toBe('idle');
    });

    it('loads when a tenant administrator signs in after the store was created', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a'));
      const { store, user } = setup(null);

      user.set(userOf('TENANT_ADMIN', 'tenant-a'));
      TestBed.tick();
      await store.load();

      expect(getOne).toHaveBeenCalledTimes(1);
      expect(store.tenant()?.id).toBe('tenant-a');
    });

    it('empties on logout', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', CONTINUOUS));
      getList.mockResolvedValueOnce({ items: [] });
      const { store, user } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();
      user.set(null);
      TestBed.tick();

      expect(store.tenant()).toBeNull();
      expect(store.hasCycles()).toBeNull();
      expect(store.status()).toBe('idle');
      expect(store.tenantName()).toBe('');
    });

    it('drops an answer that arrives after the logout', async () => {
      const pending = deferred<EcoStoreTenant>();

      getOne.mockReturnValueOnce(pending.promise);
      const { store, user } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      user.set(null);
      TestBed.tick();
      pending.resolve(tenantOf('tenant-a'));
      await pending.promise;
      await Promise.resolve();

      expect(store.tenant()).toBeNull();
      expect(store.status()).toBe('idle');
    });

    it('drops the answer for the previous user when another tenant administrator takes over', async () => {
      const first = deferred<EcoStoreTenant>();
      const second = deferred<EcoStoreTenant>();

      getOne.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
      const { store, user } = setup(userOf('TENANT_ADMIN', 'tenant-a', 'user-a'));

      user.set(userOf('TENANT_ADMIN', 'tenant-b', 'user-b'));
      TestBed.tick();
      second.resolve(tenantOf('tenant-b'));
      await store.load();
      first.resolve(tenantOf('tenant-a'));
      await first.promise;
      await Promise.resolve();

      expect(getOne).toHaveBeenNthCalledWith(1, 'tenant-a', { requestKey: null });
      expect(getOne).toHaveBeenNthCalledWith(2, 'tenant-b', { requestKey: null });
      expect(store.tenant()?.id).toBe('tenant-b');
      expect(store.status()).toBe('loaded');
    });

    it('does not show the previous tenant while the next one loads', async () => {
      const second = deferred<EcoStoreTenant>();

      getOne.mockResolvedValueOnce(tenantOf('tenant-a')).mockReturnValueOnce(second.promise);
      const { store, user } = setup(userOf('TENANT_ADMIN', 'tenant-a', 'user-a'));

      await store.load();
      user.set(userOf('TENANT_ADMIN', 'tenant-b', 'user-b'));
      TestBed.tick();

      expect(store.status()).toBe('loading');
      expect(store.tenant()).toBeNull();

      second.resolve(tenantOf('tenant-b'));
      await store.load();

      expect(store.tenant()?.id).toBe('tenant-b');
    });

    it('does not fetch again when the user object is replaced and the tenant is the same', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a'));
      const { store, user } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();
      user.set({ ...userOf('TENANT_ADMIN', 'tenant-a'), name: 'Renamed user' });
      TestBed.tick();
      await store.load();

      expect(getOne).toHaveBeenCalledTimes(1);
      expect(store.status()).toBe('loaded');
    });
  });

  describe('load and reload', () => {
    it('shares one request between concurrent calls', async () => {
      const pending = deferred<EcoStoreTenant>();

      getOne.mockReturnValueOnce(pending.promise);
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));
      const calls = [store.load(), store.load()];

      pending.resolve(tenantOf('tenant-a'));
      await Promise.all(calls);

      expect(getOne).toHaveBeenCalledTimes(1);
      expect(store.status()).toBe('loaded');
    });

    it('ends in error without rejecting when the tenant cannot be fetched, and retries on the next call', async () => {
      getOne.mockRejectedValueOnce(new Error('offline'));
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await expect(store.load()).resolves.toBeUndefined();

      expect(store.status()).toBe('error');
      expect(store.tenant()).toBeNull();
      expect(store.hasCyclesSection()).toBe(true);

      getOne.mockResolvedValueOnce(tenantOf('tenant-a'));
      await store.load();

      expect(getOne).toHaveBeenCalledTimes(2);
      expect(store.status()).toBe('loaded');
    });

    it('fetches again on reload and replaces the record', async () => {
      getOne
        .mockResolvedValueOnce(tenantOf('tenant-a', { shortName: 'Before' }))
        .mockResolvedValueOnce(tenantOf('tenant-a', { shortName: 'After' }));
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();
      await store.reload();

      expect(getOne).toHaveBeenCalledTimes(2);
      expect(store.tenantName()).toBe('After');
    });

    it('keeps the record readable during a reload and after a failed one', async () => {
      const pending = deferred<EcoStoreTenant>();

      getOne.mockResolvedValueOnce(tenantOf('tenant-a')).mockReturnValueOnce(pending.promise);
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();
      const reloading = store.reload();

      expect(store.status()).toBe('loading');
      expect(store.tenant()?.id).toBe('tenant-a');

      pending.reject(new Error('offline'));
      await reloading;

      expect(store.status()).toBe('error');
      expect(store.tenant()?.id).toBe('tenant-a');
    });

    it('lets a reload take over a load in flight, and settles both with the newer answer', async () => {
      const first = deferred<EcoStoreTenant>();
      const second = deferred<EcoStoreTenant>();

      getOne.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));
      const loading = store.load();
      const reloading = store.reload();
      let hasLoadSettled = false;

      void loading.then(() => (hasLoadSettled = true));
      first.resolve(tenantOf('tenant-a', { shortName: 'Stale' }));
      await first.promise;
      await Promise.resolve();
      await Promise.resolve();

      expect(hasLoadSettled).toBe(false);
      expect(store.status()).toBe('loading');

      second.resolve(tenantOf('tenant-a', { shortName: 'Fresh' }));
      await Promise.all([loading, reloading]);

      expect(store.tenantName()).toBe('Fresh');
      expect(store.status()).toBe('loaded');
    });

    it('empties the store on reload without a tenant', async () => {
      const { store } = setup(userOf('GLOBAL_ADMIN', 'tenant-a'));

      await store.reload();

      expect(collection).not.toHaveBeenCalled();
      expect(store.status()).toBe('idle');
    });
  });

  describe('tenantName', () => {
    it('falls back to the full name when there is no short name', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', { shortName: '', name: 'El Llevat SCCL' }));
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();

      expect(store.tenantName()).toBe('El Llevat SCCL');
    });
  });

  describe('isContinuous', () => {
    it('is false while nothing is loaded', () => {
      const { store } = setup(null);

      expect(store.isContinuous()).toBe(false);
    });

    it.each([
      [
        'the order window is enabled',
        { logisticsConfig: { orderWindow: { enabled: true } } },
        false,
      ],
      [
        'the order window is disabled',
        { logisticsConfig: { orderWindow: { enabled: false } } },
        true,
      ],
      ['the order window key is absent', { logisticsConfig: {} }, true],
      ['the logistics configuration is absent', { logisticsConfig: undefined }, true],
    ])('when %s', async (_case, overrides, expected) => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', overrides));
      getList.mockResolvedValueOnce({ items: [{ id: 'cycle-1' }] });
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();

      expect(store.isContinuous()).toBe(expected);
    });
  });

  describe('hasCyclesSection', () => {
    it('stays while nothing is loaded', () => {
      const { store } = setup(null);

      expect(store.hasCyclesSection()).toBe(true);
    });

    it('stays while the tenant loads', () => {
      getOne.mockReturnValueOnce(deferred<EcoStoreTenant>().promise);
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      expect(store.status()).toBe('loading');
      expect(store.hasCyclesSection()).toBe(true);
    });

    it('stays for a tenant with an order window, and never asks for its cycles', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a'));
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();

      expect(getList).not.toHaveBeenCalled();
      expect(store.hasCycles()).toBeNull();
      expect(store.hasCyclesSection()).toBe(true);
    });

    it('stays for a continuous tenant that holds a cycle', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', CONTINUOUS));
      getList.mockResolvedValueOnce({ items: [{ id: 'cycle-1' }] });
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();

      expect(getList).toHaveBeenCalledWith(1, 1, {
        filter: "tenant = 'tenant-a'",
        fields: 'id',
        skipTotal: true,
        requestKey: null,
      });
      expect(filter).toHaveBeenCalledWith('tenant = {:tenantId}', { tenantId: 'tenant-a' });
      expect(store.hasCycles()).toBe(true);
      expect(store.hasCyclesSection()).toBe(true);
    });

    it('disappears for a continuous tenant that holds no cycle', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', CONTINUOUS));
      getList.mockResolvedValueOnce({ items: [] });
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();

      expect(store.hasCycles()).toBe(false);
      expect(store.hasCyclesSection()).toBe(false);
    });

    it('stays when the cycle lookup fails, and the tenant still counts as loaded', async () => {
      getOne.mockResolvedValueOnce(tenantOf('tenant-a', CONTINUOUS));
      getList.mockRejectedValueOnce(new Error('offline'));
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();

      expect(store.status()).toBe('loaded');
      expect(store.hasCycles()).toBeNull();
      expect(store.hasCyclesSection()).toBe(true);
    });

    it('does not reappear while a reload is on its way', async () => {
      const pending = deferred<EcoStoreTenant>();

      getOne
        .mockResolvedValueOnce(tenantOf('tenant-a', CONTINUOUS))
        .mockReturnValueOnce(pending.promise);
      getList.mockResolvedValue({ items: [] });
      const { store } = setup(userOf('TENANT_ADMIN', 'tenant-a'));

      await store.load();
      const reloading = store.reload();

      expect(store.status()).toBe('loading');
      expect(store.hasCyclesSection()).toBe(false);

      pending.resolve(tenantOf('tenant-a', CONTINUOUS));
      await reloading;

      expect(store.hasCyclesSection()).toBe(false);
    });
  });
});
