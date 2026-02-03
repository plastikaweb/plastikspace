import {
  updateState,
  withDevtools,
  withImmutableState,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps } from '@ngrx/signals';
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
import { inject } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { EcoStoreCartsApiService } from './eco-store-carts-api.service';
import { patchState } from '@ngrx/signals';
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
  withStorageSync({
    key: 'eco_cart_v1',
    autoSync: true,
  }),
  withProps(() => ({
    _userProfileStore: inject(pocketBaseUserProfileStore),
    _cartsService: inject(EcoStoreCartsApiService),
  })),
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
          address: store.address()?.id || null,
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
          // Try to find if user already has a cart in DB before creating?
          // For now, let's assume we create if no remoteCartId
          const newCart = await firstValueFrom(
            store._cartsService.create(cartData as EcoStoreCart)
          );
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
          // If we have a remote cart, we might want to delete it or just clear items
          // For now, let's just clear items in the remote cart
          saveCartToRemote();
        }
      },

      updateLogistics(logistics: Partial<EcoStoreCartState>) {
        updateState(store, '[Cart] Update Logistics', state => ({
          ...state,
          ...logistics,
        }));

        // Recalculate if shipping changed
        if (logistics.shipping !== undefined) {
          _recalculatePrices();
        }

        if (store._userProfileStore.isAuthenticated()) {
          saveCartToRemote();
        }
      },
    };
  })
);
