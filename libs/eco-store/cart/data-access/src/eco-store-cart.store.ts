import {
  updateState,
  withConditional,
  withDevtools,
  withImmutableState,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { computed, effect, inject, untracked } from '@angular/core';
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
  SlotDays,
  TimeRange,
} from '@plastik/eco-store/entities';
import { EcoStoreProductsApiService } from '@plastik/eco-store/products/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { catchError, firstValueFrom, take } from 'rxjs';
import { EcoStoreCartsApiService } from './eco-store-carts-api.service';

export interface EcoStoreCartState {
  address: UserContact | null;
  method: EcoStoreTenantLogisticsDeliveryType | null;
  day: SlotDays | null;
  time: TimeRange | null;
  noDayAndTime: boolean;
  shipping: number;
  status: EcoStoreCartStatus;
  expiresAt: Date | null;
  orderCycle: string | null;
  notes: string | null;

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
  noDayAndTime: false,
  shipping: 0,
  status: 'ACTIVE',
  expiresAt: null,
  orderCycle: null,
  notes: null,

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
  withDevtools('cart'),
  withImmutableState<EcoStoreCartState>(initialState),
  withEntities<EcoStoreCartItem>(),
  withProps(() => ({
    _userProfileStore: inject(pocketBaseUserProfileStore),
    _cartsService: inject(EcoStoreCartsApiService),
    _productsService: inject(EcoStoreProductsApiService),
    _tenantStore: inject(ecoStoreTenantStore),
    _notificationStore: inject(notificationStore),
    _translateService: inject(TranslateService),
    _liveAnnouncer: inject(LiveAnnouncer),
  })),
  withConditional(
    store => !store._userProfileStore.isAuthenticated(),
    withStorageSync({
      key: 'eco_cart_v1',
      autoSync: true,
    }),
    withStorageSync({
      key: 'eco_cart_v1',
      autoSync: false,
    })
  ),
  withComputed(({ entities, entityMap }) => ({
    itemsCount: computed(() => entities().length),
    isEmpty: computed(() => entities().length === 0),
    itemsDictionary: computed(() => entityMap()),
    items: computed(() => entities()),
    itemsGroupedByCategory: computed(() => {
      return Object.groupBy(entities(), (item: EcoStoreCartItem) => item.product.categoryName);
    }),
  })),

  withMethods(store => {
    const checkStoreStatus = (): boolean => {
      const status = store._tenantStore.storeStatus();
      if (status === 'CLOSED' || status === 'CLOSED_MANUALLY') {
        const message = store._translateService.instant('store.status.closedMessage');

        store._liveAnnouncer.announce(message, 'assertive', 5000);

        store._notificationStore.show({
          type: 'WARNING',
          message,
          action: 'common.notification.close',
          duration: 5000,
        });
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
      const { subtotal, tax, total } = calculatePricesState(store.entities(), store.shipping());

      updateState(store, '[cart] recalculate prices', state => ({
        ...state,
        subtotal,
        tax,
        total,
      }));
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
    };

    const _removeItem = (productId: EcoStoreProductWithCategoryName['id']) => {
      updateState(store, `[cart] remove item ${productId}`, removeEntity(productId));
    };

    const _stripUIProps = (items: EcoStoreCartItem[]) => {
      return items.map(({ product, quantity }) => ({
        product: { ...product },
        quantity,
      }));
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
          day: store.day(),
          time: store.time(),
          noDayAndTime: store.noDayAndTime(),
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
            .getFirstListItem(`user = "${user.id}"`, {
              sort: '-updated',
              requestKey: 'cart_sync_find',
              headers: { 'remove-from-global-loading': 'true' },
            })
            .pipe(
              take(1),
              catchError(err => {
                throw new Error(`Error getting remote cart: ${err}` as string);
              })
            )
        );

        const localItems = store.items();
        let itemsToProcess: EcoStoreCartItem[] = [];

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
          const filter = itemsToProcess.map(i => `id = "${i.product.id}"`).join(' || ');

          const latestProducts = (await firstValueFrom(
            store._productsService
              .getFullList({ filter, requestKey: 'cart_products' })
              .pipe(take(1))
          )) as EcoStoreProduct[];

          const productMap = new Map(latestProducts.map(p => [p.id, p]));

          itemsToProcess = itemsToProcess.map(item => {
            const latest = productMap.get(item.product.id);
            if (latest && latest.priceWithIva !== item.product.priceWithIva) {
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

        const statePayload: Partial<EcoStoreCartState> = {
          isSyncing: false,
          isSynced: true,
          remoteCartId: finalRemoteId,
          subtotal,
          tax: totalIva - subtotal,
          total: totalIva + shipping,
          shipping,
        };

        if (remoteCart) {
          Object.assign(statePayload, {
            address: remoteCart.address,
            method: remoteCart.deliveryMethod,
            day: remoteCart.day,
            time: remoteCart.time,
            noDayAndTime: remoteCart.noDayAndTime,
            status: remoteCart.status,
            notes: remoteCart.notes,
          });
        }

        // Update the entire state at once to avoid flicker
        updateState(
          store,
          '[cart] merge success',
          state => ({ ...state, ...statePayload }),
          setAllEntities(itemsToProcess, { selectId: i => i.product.id })
        );

        store.clearStorage();
      } catch {
        updateState(store, '[cart] merge error', state => ({ ...state, isSyncing: false }));
      }
    };

    return {
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
        updateState(store, '[Cart] Update Logistics', state => ({
          ...state,
          ...logistics,
        }));

        if (logistics.shipping !== undefined) {
          _recalculatePrices();
        }

        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },

      loadAndMergeUserCart() {
        _loadAndMergeUserCart();
      },
    };
  }),

  withHooks(store => ({
    onInit() {
      effect(() => {
        const isAuthenticated = store._userProfileStore.isAuthenticated();
        const isSynced = store.isSynced();
        const isTenantLoaded = store._tenantStore.loaded();
        // Use untracked to prevent the merge from triggering the effect again
        const isSyncing = untracked(() => store.isSyncing());

        if (isAuthenticated && isTenantLoaded && !isSynced && !isSyncing) {
          store.loadAndMergeUserCart();
        } else if (!isAuthenticated && isSynced) {
          updateState(store, '[cart] reset sync state', s => ({
            ...s,
            isSynced: false,
            remoteCartId: null,
          }));
        }
      });
    },
  }))
);
