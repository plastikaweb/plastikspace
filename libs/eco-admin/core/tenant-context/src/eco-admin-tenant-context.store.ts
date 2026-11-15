import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
} from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject, isDevMode, untracked } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { EcoStoreTenant } from '@plastik/eco/entities';

export type EcoAdminTenantContextStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface EcoAdminTenantContextState {
  tenant: EcoStoreTenant | null;
  status: EcoAdminTenantContextStatus;
  hasCycles: boolean | null;
}

const initialState: EcoAdminTenantContextState = {
  tenant: null,
  status: 'idle',
  hasCycles: null,
};

/**
 * Whether a tenant sells around the clock instead of through a weekly order window.
 * A tenant is continuous when `logisticsConfig.orderWindow.enabled` is false or the key is absent.
 * @param {EcoStoreTenant} tenant The tenant record.
 * @returns {boolean} True when the tenant has no weekly order window.
 */
function isContinuousTenant(tenant: EcoStoreTenant): boolean {
  return tenant.logisticsConfig?.orderWindow?.enabled !== true;
}

/**
 * The tenant the signed-in administrator works on.
 *
 * A tenant administrator's tenant comes from their own user record; nobody chooses it. A global administrator
 * has no tenant context: `users.tenant` is a required field, so their record carries one too, and the store
 * ignores it on purpose.
 *
 * The store follows the session by itself. It loads when a tenant administrator signs in or a session is
 * restored, and empties on logout.
 */
export const ecoAdminTenantContextStore = signalStore(
  { providedIn: 'root' },
  isDevMode()
    ? withDevtools('eco-admin-tenant-context')
    : withDevToolsStub('eco-admin-tenant-context'),
  withImmutableState<EcoAdminTenantContextState>(initialState),
  withProps(() => ({
    _pb: inject(POCKETBASE_INSTANCE),
    _profile: inject(pocketBaseUserProfileStore),
  })),
  withComputed(store => ({
    /**
     * The id of the administrator's tenant, or null for anyone who is not a tenant administrator.
     */
    tenantId: computed(() =>
      store._profile.isTenantAdmin() ? store._profile.user()?.tenant || null : null
    ),
  })),
  withComputed(store => ({
    hasTenant: computed(() => store.tenantId() !== null),
    /**
     * The name to print next to the product name: the short name, else the full name, else an empty string.
     */
    tenantName: computed(() => store.tenant()?.shortName || store.tenant()?.name || ''),
    /**
     * True once the tenant is loaded and it has no weekly order window. False while nothing is loaded.
     */
    isContinuous: computed(() => {
      const tenant = store.tenant();

      return tenant !== null && isContinuousTenant(tenant);
    }),
  })),
  withComputed(store => ({
    /**
     * Whether the Cicles section exists for this tenant.
     * It disappears only for a continuous tenant that holds no cycle at all. While the answer is unknown
     * (nothing loaded yet, a failed load, the cycle lookup unavailable) the section stays, and a reload keeps
     * the previous answer until the new one arrives, so the entry never flickers.
     */
    hasCyclesSection: computed(() => !(store.isContinuous() && store.hasCycles() === false)),
  })),
  withMethods(store => {
    let running: { tenantId: string; request: Promise<void> } | null = null;

    /**
     * Empties the store and disowns whatever request is still on its way.
     * @returns {void}
     */
    const clear = (): void => {
      running = null;
      updateState(store, '[tenant context] clear', initialState);
    };

    /**
     * Asks whether a continuous tenant holds at least one cycle.
     * @param {string} tenantId The tenant to look up.
     * @returns {Promise<boolean | null>} The answer, or null when the request failed.
     */
    const fetchHasCycles = async (tenantId: string): Promise<boolean | null> => {
      try {
        const page = await store._pb.collection('order_cycles').getList(1, 1, {
          filter: store._pb.filter('tenant = {:tenantId}', { tenantId }),
          fields: 'id',
          skipTotal: true,
          requestKey: null,
        });

        return page.items.length > 0;
      } catch {
        return null;
      }
    };

    /**
     * Fetches the tenant, and its cycle presence when it is continuous, then writes the result.
     * A result is written only while its request is still the running one: an answer that arrives after a
     * logout, a change of user or a newer reload is dropped.
     * Both requests opt out of the SDK's auto-cancellation (`requestKey: null`), which keys on method and
     * path alone and would otherwise let a view listing `order_cycles` abort the lookup, or the reverse.
     * @param {string} tenantId The tenant to fetch.
     * @param {() => boolean} isRunning Whether this request is still the running one.
     * @returns {Promise<void>} Resolves when the state is written or the result dropped. Never rejects.
     */
    const fetchTenant = async (tenantId: string, isRunning: () => boolean): Promise<void> => {
      updateState(store, '[tenant context] load', state => ({
        status: 'loading' as const,
        ...(state.tenant?.id === tenantId ? {} : { tenant: null, hasCycles: null }),
      }));

      try {
        const tenant = await store._pb
          .collection('tenants')
          .getOne<EcoStoreTenant>(tenantId, { requestKey: null });
        const hasCycles = isContinuousTenant(tenant) ? await fetchHasCycles(tenantId) : null;

        if (isRunning()) {
          updateState(store, '[tenant context] load success', {
            tenant,
            hasCycles,
            status: 'loaded',
          });
        }
      } catch {
        if (isRunning()) {
          updateState(store, '[tenant context] load failure', { status: 'error' });
        }
      }
    };

    /**
     * Starts a fetch and makes it the running one, taking over from any earlier request.
     * A request that was taken over settles together with the one that replaced it, so whoever awaits it
     * still gets a settled store.
     * @param {string} tenantId The tenant to fetch.
     * @returns {Promise<void>} The new request.
     */
    const start = (tenantId: string): Promise<void> => {
      const entry = { tenantId, request: Promise.resolve() };

      running = entry;
      entry.request = fetchTenant(tenantId, () => running === entry).then(() => {
        if (running === entry) {
          running = null;

          return undefined;
        }

        return running?.request;
      });

      return entry.request;
    };

    return {
      /**
       * Loads the administrator's tenant once.
       * Safe to call any number of times: a loaded tenant is not fetched again and concurrent calls share one
       * request. Without a tenant (a global administrator, or no session) it empties the store instead.
       * A failure leaves `status` at `error` and raises no notification; the next call tries again.
       * @returns {Promise<void>} Resolves when the store is settled. Never rejects.
       */
      load(): Promise<void> {
        const tenantId = untracked(store.tenantId);

        if (tenantId === null) {
          clear();

          return Promise.resolve();
        }

        if (running?.tenantId === tenantId) {
          return running.request;
        }

        if (untracked(store.status) === 'loaded' && untracked(store.tenant)?.id === tenantId) {
          return Promise.resolve();
        }

        return start(tenantId);
      },
      /**
       * Fetches the administrator's tenant again, whatever the store already holds.
       * Call it after the tenant's settings or its cycles changed. The record already in the store stays
       * readable while the new one is on its way, and survives a failed reload.
       * @returns {Promise<void>} Resolves when the store is settled. Never rejects.
       */
      reload(): Promise<void> {
        const tenantId = untracked(store.tenantId);

        if (tenantId === null) {
          clear();

          return Promise.resolve();
        }

        return start(tenantId);
      },
    };
  }),
  withHooks({
    /**
     * Keeps the store in step with the session.
     * The effect depends on the tenant id alone, a primitive: a profile edit that replaces the user object
     * without changing its tenant fetches nothing.
     * @param {typeof ecoAdminTenantContextStore} store The store instance.
     * @returns {void}
     */
    onInit(store) {
      effect(() => {
        store.tenantId();
        untracked(() => void store.load());
      });
    },
  })
);
