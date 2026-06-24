import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
} from '@angular-architects/ngrx-toolkit';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, isDevMode, PLATFORM_ID, untracked } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import {
  removeAllEntities,
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { UserContact } from '@plastik/core/entities';
import {
  EcoStoreCart,
  EcoStoreCartItem,
  EcoStoreCartStatus,
  EcoStoreProduct,
  EcoStoreProductWithCategoryName,
  EcoStoreTenantLogisticsDeliveryType,
  generateOrderNumber,
  NewEcoStoreOrder,
  SlotDays,
  TimeRange,
  toOrderItemSnapshot,
} from '@plastik/eco-store/entities';
import { EcoStoreProductsApiService } from '@plastik/eco-store/products/data-access';
import { getPocketBaseImageUrl } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { withResetEntities } from '@plastik/signal-state/reset';
import { catchError, firstValueFrom, of, take } from 'rxjs';
import { EcoStoreCartsApiService } from './eco-store-carts-api.service';

export interface EcoStoreCartState {
  address: UserContact | null;
  method: EcoStoreTenantLogisticsDeliveryType | null;
  day: SlotDays | null;
  time: TimeRange | null;
  shipping: number;
  status: EcoStoreCartStatus;
  expiresAt: Date | null;
  orderCycle: string | null;
  notes: string | null;
  priceHasChanged: boolean;

  // Sync fields
  remoteCartId: string | null;
  isSyncing: boolean;
  isSynced: boolean;

  // Calculated values (previously computed)
  subtotal: number;
  tax: number;
  total: number;
}

const initialState: EcoStoreCartState = {
  method: null,
  address: null,
  day: null,
  time: null,
  shipping: 0,
  status: 'ACTIVE',
  expiresAt: null,
  orderCycle: null,
  notes: null,
  priceHasChanged: false,

  // Sync fields
  remoteCartId: null,
  isSyncing: false,
  isSynced: false,

  // Calculated values
  subtotal: 0,
  tax: 0,
  total: 0,
};

export const ecoStoreCartStore = signalStore(
  { providedIn: 'root' },
  isDevMode() ? withDevtools('cart') : withDevToolsStub('cart'),
  withImmutableState<EcoStoreCartState>(initialState),
  withEntities<EcoStoreCartItem>(),
  withResetEntities('cart', { isSynced: true }),
  withProps(() => ({
    _userProfileStore: inject(pocketBaseUserProfileStore),
    _cartsService: inject(EcoStoreCartsApiService),
    _productsService: inject(EcoStoreProductsApiService),
    _tenantStore: inject(ecoStoreTenantStore),
    _notificationService: inject(StoreNotificationService),
    _translateService: inject(TranslateService),
    _liveAnnouncer: inject(LiveAnnouncer),
    _confirmService: inject(SharedConfirmDialogService),
    _platformId: inject(PLATFORM_ID),
  })),

  withComputed(({ entities, entityMap, method, address, day, time, _tenantStore }) => {
    return {
      storageKey: computed(() => `${_tenantStore.tenant()?.normalizedName ?? 'eco'}-cart-v1`),
      itemsCount: () => entities().length,
      isEmpty: () => entities().length === 0,
      isShippingOk: () => {
        const currentMethod = method();
        const currentAddress = address();
        if (!currentMethod || !currentAddress) return false;

        const slotDays = _tenantStore.getTenantDeliveryOptionSlotsDays(
          currentMethod,
          currentAddress.id
        );

        if (slotDays.length > 0 && (!day() || !time())) return false;

        return true;
      },
      itemsDictionary: () => entityMap(),
      items: () => entities(),
      itemsGroupedByCategory: (): { category: string; items: EcoStoreCartItem[] }[] => {
        const grouped = Object.groupBy(
          entities(),
          (item: EcoStoreCartItem) => item.product.categoryName
        );
        return Object.entries(grouped).map(([category, items]) => ({
          category,
          items: items as EcoStoreCartItem[],
        }));
      },
    };
  }),

  withMethods(store => {
    const _confirmation = (
      title: string,
      message: string,
      ko: string,
      ok: { label: string; route: string[] },
      params: null,
      icon: string
    ) => store._confirmService.confirm(title, message, ko, ok, params, icon);

    const checkStoreStatus = (): boolean => {
      const status = store._tenantStore.storeStatus();
      if (status === 'CLOSED' || status === 'CLOSED_MANUALLY') {
        const message = store._translateService.instant('store.status.closedMessage');
        store._notificationService.create(message, 'ERROR');

        return false;
      }
      return true;
    };

    // Pure helper to calculate prices without modifying state directly (to be used within batch updates)
    const calculatePricesState = (items: EcoStoreCartItem[], currentShipping: number) => {
      const subtotal = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
      const totalWithIva = items.reduce(
        (acc, item) => acc + item.quantity * item.product.priceWithIva,
        0
      );
      const tax = totalWithIva - subtotal;
      const total = totalWithIva + currentShipping;

      return { subtotal, tax, total };
    };

    const _recalculatePrices = () => {
      if (store.entities().length === 0) {
        return store.reset();
      }

      const { subtotal, tax, total } = calculatePricesState(store.entities(), store.shipping());

      updateState(store, '[cart] recalculate prices', state => ({
        ...state,
        subtotal,
        tax,
        total,
        shipping: _calculateShipping(),
      }));
    };

    const _calculateShipping = () => {
      const { method, subtotal, tax } = store;
      const currentMethod = method();
      const totalAmount = subtotal() + tax() || 0;
      let shipping = 0;
      if (currentMethod) {
        shipping = store._tenantStore.getTenantDeliveryOptionCost(currentMethod, totalAmount);
      }

      return shipping;
    };

    const _setItem = (
      product: EcoStoreProductWithCategoryName,
      quantity: number,
      isUpdate = false
    ) => {
      updateState(
        store,
        isUpdate ? `cart.update.${product.id}` : `cart.add.${product.id}`,
        setEntity(
          { product, quantity },
          {
            selectId: item => item.product.id,
          }
        )
      );
      // BUG-004: share one notification per product via groupKey so a burst of +/- collapses to a
      // single toast reflecting the latest state instead of stacking duplicates.
      store._notificationService.create(
        isUpdate ? 'cart.productUpdated' : 'cart.productAdded',
        'SUCCESS',
        { groupKey: `cart:${product.id}` },
        { name: product.name, image: getPocketBaseImageUrl(product, product.images?.[0]) }
      );
    };

    const _removeItem = (productId: EcoStoreProductWithCategoryName['id']) => {
      const name = store.entityMap()[productId]?.product.name;
      const image = getPocketBaseImageUrl(
        store.entityMap()[productId]?.product,
        store.entityMap()[productId]?.product.images?.[0]
      );
      updateState(store, `[cart] remove item ${productId}`, removeEntity(productId));
      // Same groupKey as add/update: a pending add/update toast for this product is replaced by the
      // removal toast (the old "cancel pending" behaviour falls out of the shared-key replacement).
      store._notificationService.create(
        'cart.productRemoved',
        'SUCCESS',
        { groupKey: `cart:${productId}` },
        { name, image }
      );
    };

    const _stripUIProps = (items: EcoStoreCartItem[]) => {
      return items.map(({ product, quantity }) => ({
        product: { ...product },
        quantity,
      }));
    };

    // Read localStorage directly to get the true local cart state.
    // store.items() may be empty at merge time since entity state is not guaranteed to
    // be populated at login. Reading directly from storage is the reliable source of truth.
    const _readLocalStorageItems = (): EcoStoreCartItem[] => {
      if (!isPlatformBrowser(store._platformId)) return [];
      try {
        const raw = localStorage.getItem(store.storageKey());
        if (!raw) return [];
        const parsed = JSON.parse(raw) as {
          ids?: string[];
          entityMap?: Record<string, EcoStoreCartItem>;
        };
        if (parsed?.ids?.length && parsed?.entityMap) {
          return parsed.ids.map(id => parsed.entityMap?.[id]).filter(Boolean) as EcoStoreCartItem[];
        }
        return [];
      } catch {
        return [];
      }
    };

    const saveCartToRemote = async () => {
      if (store.isSyncing() || !store._tenantStore.loaded()) return;

      const user = store._userProfileStore.user();
      if (!user) return;

      updateState(store, '[cart] save cart to remote', state => ({
        ...state,
        isSyncing: true,
      }));

      try {
        const cartData: Partial<EcoStoreCart> = {
          user: user.id,
          items: _stripUIProps(store.items()),
          status: store.status(),
          expiresAt: store.expiresAt(),
          orderCycle: store.orderCycle(),
          notes: store.notes(),
          address: store.address() || null,
          deliveryMethod: store.method() || 'pickup',
          day: store.day() || null,
          time: store.time() || null,
          shipping: store.shipping(),
          tax: store.tax(),
          subtotal: store.subtotal(),
          total: store.total(),
        };

        const remoteCartId = store.remoteCartId();

        if (remoteCartId) {
          await firstValueFrom(store._cartsService.update(remoteCartId, cartData));
        } else {
          const newCart = await firstValueFrom(store._cartsService.create(cartData));
          updateState(store, '[cart] save cart to remote', state => ({
            ...state,
            remoteCartId: newCart.id,
          }));
        }
      } catch {
        // Silent catch
      } finally {
        updateState(store, '[cart] save cart to remote', state => ({
          ...state,
          isSyncing: false,
        }));
      }
    };

    const _loadAndMergeUserCart = async () => {
      if (store.isSyncing() || store.isSynced()) return;

      // Read localStorage synchronously BEFORE any state changes or async operations.
      // store.items() may be empty at this point (entity state not guaranteed to be in sync).
      // Read directly from localStorage which still holds the anonymous cart.
      const localItems = _readLocalStorageItems();

      updateState(store, '[cart] merge start', state => ({
        ...state,
        isSyncing: true,
      }));

      const user = store._userProfileStore.user();
      if (!user) {
        updateState(store, '[cart] merge cancel - no user', state => ({
          ...state,
          isSyncing: false,
        }));
        return;
      }

      try {
        // 1. Find remote cart (independent of the shop stream)
        const remoteCart = await firstValueFrom(
          store._cartsService
            .getFirstListItem(`user ="${user.id}"`, {
              sort: '-updated',
              requestKey: 'cart_sync_find',
            })
            .pipe(
              take(1),
              catchError(() => of(null))
            )
        );

        let itemsToProcess: EcoStoreCartItem[] = [];
        const hadLocalItems = !!localItems?.length;
        const hadRemoteItems = !!remoteCart?.items?.length;

        if (remoteCart) {
          const mergedMap = new Map<string, EcoStoreCartItem>();
          (remoteCart.items || []).forEach((item: EcoStoreCartItem) => {
            mergedMap.set(item.product.id, { ...item });
          });

          localItems.forEach(local => {
            const existing = mergedMap.get(local.product.id);
            if (existing) {
              existing.quantity += local.quantity;
            } else {
              mergedMap.set(local.product.id, { ...local });
            }
          });
          itemsToProcess = Array.from(mergedMap.values());
        } else {
          itemsToProcess = [...localItems];
        }

        // 2. Price Verification
        // Force an isolated and ephemeral subscription with take(1) and firstValueFrom
        if (itemsToProcess.length > 0) {
          const filter = itemsToProcess.map(i => `id ="${i.product.id}"`).join(' || ');

          const latestProducts = (await firstValueFrom(
            store._productsService
              .getFullList({ filter, requestKey: 'cart_products' })
              .pipe(take(1))
          )) as EcoStoreProduct[];

          const productMap = new Map(latestProducts.map(p => [p.id, p]));

          itemsToProcess = itemsToProcess.map(item => {
            const latest = productMap.get(item.product.id);
            if (latest && latest.priceWithIva !== item.product.priceWithIva) {
              updateState(store, '[cart] price change', state => ({
                ...state,
                priceHasChanged: true,
              }));

              return {
                ...item,
                product: {
                  ...item.product,
                  price: latest.price,
                  iva: latest.iva,
                  priceWithIva: latest.priceWithIva,
                },
                hasPriceChanged: true,
                oldPriceWithIva: item.product.priceWithIva,
              };
            }
            return item;
          });
        }

        // 3. Final remote synchronization
        let finalRemoteId = remoteCart?.id || null;
        if (remoteCart || localItems.length > 0) {
          const syncData: Partial<EcoStoreCart> = {
            items: _stripUIProps(itemsToProcess),
          };

          if (remoteCart) {
            await firstValueFrom(store._cartsService.update(remoteCart.id, syncData).pipe(take(1)));
          } else {
            const fullData: Partial<EcoStoreCart> = {
              user: user.id,
              items: _stripUIProps(itemsToProcess),
              status: store.status(),
              deliveryMethod: store.method() || 'pickup',
            };
            const newCart = await firstValueFrom(
              store._cartsService.create(fullData).pipe(take(1))
            );
            finalRemoteId = newCart.id;
          }
        }

        // 4. Preparation of the final state for ATOMIC update
        const subtotal = itemsToProcess.reduce((acc, i) => acc + i.quantity * i.product.price, 0);
        const totalIva = itemsToProcess.reduce(
          (acc, i) => acc + i.quantity * i.product.priceWithIva,
          0
        );
        const shipping = remoteCart ? remoteCart.shipping : store.shipping();

        let statePayload: Partial<EcoStoreCartState> = {
          isSyncing: false,
          isSynced: true,
          remoteCartId: finalRemoteId,
          subtotal,
          tax: totalIva - subtotal,
          total: totalIva + shipping,
          shipping,
        };

        if (remoteCart) {
          statePayload = {
            ...statePayload,
            address: remoteCart.address,
            method: remoteCart.deliveryMethod,
            day: remoteCart.day,
            time: remoteCart.time,
            status: remoteCart.status,
            notes: remoteCart.notes,
          };
        }

        // Update the entire state at once to avoid flicker
        updateState(
          store,
          '[cart] merge success',
          state => ({ ...state, ...statePayload }),
          setAllEntities(itemsToProcess, { selectId: i => i.product.id })
        );

        if (isPlatformBrowser(store._platformId)) {
          localStorage.removeItem(store.storageKey());
        }

        // Notify when a real merge happened (both sources had items)
        if (store.priceHasChanged()) {
          _confirmation(
            'cart.priceUpdatedNotification.title',
            'cart.priceUpdatedNotification.message',
            'cart.priceUpdatedNotification.ko',
            { label: 'cart.priceUpdatedNotification.ok', route: ['/cistella'] },
            null,
            'info'
          );
        } else if (hadLocalItems && hadRemoteItems) {
          _confirmation(
            'cart.mergeNotification.title',
            'cart.mergeNotification.message',
            'cart.mergeNotification.ko',
            { label: 'cart.mergeNotification.ok', route: ['/cistella'] },
            null,
            'info'
          );
        }
      } catch {
        updateState(store, '[cart] merge error', state => ({ ...state, isSyncing: false }));
      }
    };

    return {
      getItemCount(productId: EcoStoreProductWithCategoryName['id']) {
        return computed(() => {
          return store.entityMap()[productId]?.quantity ?? 0;
        });
      },

      addToCart(product: EcoStoreProductWithCategoryName, quantity = 1) {
        if (!checkStoreStatus()) return;
        const productId = product.id;
        const existingItem = store.entityMap()[productId];

        if (quantity <= 0) {
          if (existingItem) {
            _removeItem(productId);
          }
          _recalculatePrices();
          if (store._userProfileStore.isAuthenticated()) {
            saveCartToRemote();
          }
          return;
        }

        _setItem(product, quantity, !!existingItem);
        _recalculatePrices();

        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },

      removeFromCart(productId: EcoStoreProductWithCategoryName['id']) {
        if (!checkStoreStatus()) return;
        _removeItem(productId);
        _recalculatePrices();
        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },

      clearCart() {
        if (!checkStoreStatus()) return;
        updateState(store, '[cart] clear cart', removeAllEntities());
        _recalculatePrices();
        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },

      updateLogistics(logistics: Partial<EcoStoreCartState>) {
        if (!checkStoreStatus()) return;

        updateState(store, '[cart] update logistics', state => {
          const newState = { ...state, ...logistics };

          if (logistics.method && logistics.method !== state.method) {
            newState.day = null;
            newState.time = null;
            return newState;
          }

          if (logistics.address && logistics.address.id !== state.address?.id) {
            newState.day = null;
            newState.time = null;
            return newState;
          }

          if (logistics.day && logistics.day !== state.day) {
            newState.time = null;
            return newState;
          }

          return newState;
        });

        _recalculatePrices();

        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },

      loadAndMergeUserCart() {
        return _loadAndMergeUserCart();
      },

      toOrder(): NewEcoStoreOrder {
        const user = store._userProfileStore.user();
        const tenant = store._tenantStore.tenant();
        const address = store.address();
        const method = store.method();
        const items = store.items();

        if (!user || !tenant || !address || !method || !items.length) {
          throw new Error('Cannot create order: missing required checkout data');
        }

        return {
          orderNumber: generateOrderNumber(tenant.normalizedName ?? ''),
          tenant: tenant.id,
          user: user.id,
          items: items.map(toOrderItemSnapshot),
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          address,
          deliveryMethod: method,
          day: store.day(),
          time: store.time(),
          notes: store.notes() ?? '',
          orderCycle: store.orderCycle() || undefined,
          language: store._translateService.getCurrentLang() || 'ca',
          shipping: store.shipping(),
          subtotal: store.subtotal(),
          tax: store.tax(),
          total: store.total(),
        };
      },
    };
  }),

  withHooks(store => ({
    onInit() {
      // Trigger merge on login, reset sync state on logout
      effect(() => {
        const isAuthenticated = store._userProfileStore.isAuthenticated();
        const isSynced = store.isSynced();
        const isTenantLoaded = store._tenantStore.loaded();
        // Use untracked to prevent the merge from triggering the effect again
        const isSyncing = untracked(() => store.isSyncing());

        if (isAuthenticated && isTenantLoaded && !isSynced && !isSyncing) {
          store.loadAndMergeUserCart();
        } else if (!isAuthenticated && isSynced) {
          // Clear all cart state on logout.
          // Calling removeAllEntities() here ensures the anonymous persistence effect
          // below sees an empty cart (ids.length === 0) and removes the LS key instead
          // of writing the authenticated cart into storage — which would cause quantity
          // doubling on the next login when _loadAndMergeUserCart merges LS + PB carts.
          updateState(
            store,
            '[cart] logout clear',
            s => ({
              ...s,
              isSynced: false,
              remoteCartId: null,
              subtotal: 0,
              tax: 0,
              total: 0,
              shipping: 0,
              method: null,
              address: null,
              day: null,
              time: null,
            }),
            removeAllEntities()
          );
          // Remove immediately — don't rely solely on the persistence effect ordering.
          if (isPlatformBrowser(store._platformId)) {
            localStorage.removeItem(store.storageKey());
          }
        }
      });

      // Restore anonymous cart from localStorage once the tenant name is known.
      // Runs once per session (or after logout) when the tenant loads and user is anonymous.
      let anonymousCartRestored = false;
      effect(() => {
        if (store._userProfileStore.isAuthenticated()) {
          anonymousCartRestored = false;
          return;
        }
        if (anonymousCartRestored || !store._tenantStore.loaded()) return;
        anonymousCartRestored = true;

        untracked(() => {
          if (!isPlatformBrowser(store._platformId)) return;
          const key = store.storageKey();
          try {
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const parsed = JSON.parse(raw) as {
              ids?: string[];
              entityMap?: Record<string, EcoStoreCartItem>;
            };
            if (parsed?.ids?.length && parsed?.entityMap) {
              const entityMap = parsed.entityMap;
              const items = parsed.ids
                .map(id => entityMap[id])
                .filter((item): item is EcoStoreCartItem => item != null);
              if (items.length > 0) {
                updateState(
                  store,
                  '[cart] restore from storage',
                  setAllEntities(items, { selectId: i => i.product.id })
                );
              }
            }
          } catch {
            // Ignore malformed storage
          }
        });
      });

      // Auto-persist anonymous cart to localStorage using the tenant-specific key.
      // Only writes when the user is anonymous and the tenant name is available.
      effect(() => {
        if (store._userProfileStore.isAuthenticated() || !isPlatformBrowser(store._platformId))
          return;
        const normalizedName = store._tenantStore.tenant()?.normalizedName;
        if (!normalizedName) return;

        const key = store.storageKey();
        const ids = store.ids();

        if (ids.length > 0) {
          localStorage.setItem(key, JSON.stringify({ ids, entityMap: store.entityMap() }));
        } else {
          localStorage.removeItem(key);
        }
      });
    },
  }))
);
