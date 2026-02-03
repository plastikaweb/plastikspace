import {
  updateState,
  withDevtools,
  withImmutableState,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { removeAllEntities, removeEntity, setEntity, withEntities } from '@ngrx/signals/entities';
import { UserContact } from '@plastik/core/entities';
import {
  EcoStoreCartStatus,
  EcoStoreProductWithCategoryName,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
  TimeRange,
} from '@plastik/eco-store/entities';

export interface CartItem {
  id: string;
  product: EcoStoreProductWithCategoryName;
  quantity: number;
}

export interface EcoStoreCartState {
  address: UserContact | null;
  method: EcoStoreTenantLogisticsDeliveryType | null;
  day: SlotDays | null;
  time: TimeRange | null;
  noDayAndTime: boolean;
  shipping: number;
  status: EcoStoreCartStatus;
  expiredAt: Date | null;
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
  expiredAt: null,
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
  withEntities<CartItem>(),
  withStorageSync({
    key: 'eco_cart_v1',
    autoSync: true,
  }),

  withComputed(({ entities, entityMap }) => ({
    itemsCount: computed(() => entities().length),
    isEmpty: computed(() => entities().length === 0),
    itemsDictionary: computed(() => entityMap()),
    items: computed(() => entities()),
    itemsGroupedByCategory: computed(() => {
      return Object.groupBy(entities(), (item: CartItem) => item.product.categoryName);
    }),
  })),

  withMethods(store => {
    // Private helper to recalculate cart prices
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
        setEntity({ id: product.id, product, quantity })
      );
    };

    const _removeItem = (productId: EcoStoreProductWithCategoryName['id']) => {
      updateState(store, `[cart] remove item ${productId}`, removeEntity(productId));
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
          return;
        }

        _setItem(product, quantity, !!existingItem);
        _recalculatePrices();
      },

      removeFromCart(productId: EcoStoreProductWithCategoryName['id']) {
        _removeItem(productId);
        _recalculatePrices();
      },

      clearCart() {
        updateState(store, '[cart] clear cart', removeAllEntities());
        _recalculatePrices();
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
      },
    };
  })
);
