import {
  updateState,
  withDevtools,
  withImmutableState,
  withStorageSync,
  withConditional,
} from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { removeAllEntities, removeEntity, setEntity, withEntities } from '@ngrx/signals/entities';
import { UserContact } from '@plastik/core/entities';
import {
  EcoStoreCart,
  EcoStoreCartItem,
  EcoStoreCartStatus,
  EcoStoreProductWithCategoryName,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
  TimeRange,
} from '@plastik/eco-store/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { EcoStoreCartsApiService } from './eco-store-carts-api.service';
import { firstValueFrom } from 'rxjs';

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
    const _recalculatePrices = () => {
      const items = store.entities();
      const subtotal = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
      const totalWithIva = items.reduce(
        (acc, item) => acc + item.quantity * item.product.priceWithIva,
        0
      );
      const tax = totalWithIva - subtotal;
      const total = totalWithIva + store.shipping();

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

    const saveCartToRemote = async () => {
      const user = store._userProfileStore.user();
      if (!user) return;

      patchState(store, { isSyncing: true });

      try {
        const cartData: Partial<EcoStoreCart> = {
          user: user.id,
          items: store.items().map(item => ({ product: item.product, quantity: item.quantity })),
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
          patchState(store, { remoteCartId: newCart.id });
        }
      } catch (error) {
        throw new Error(`Error saving cart to PocketBase: ${error}`);
      } finally {
        patchState(store, { isSyncing: false });
      }
    };

    return {
      getItemCount(productId: EcoStoreProductWithCategoryName['id']) {
        return computed(() => {
          return store.entityMap()[productId]?.quantity ?? 0;
        });
      },

      addToCart(product: EcoStoreProductWithCategoryName, quantity = 1) {
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
        _removeItem(productId);
        _recalculatePrices();
        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },

      clearCart() {
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
    };
  }),

  withHooks(store => ({
    onInit() {
      effect(() => {
        const isAuthenticated = store._userProfileStore.isAuthenticated();

        if (isAuthenticated) {
          // store.clearStorage();
        }
      });
    },
  }))
);
