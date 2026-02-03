import { updateState, withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { removeAllEntities, removeEntity, setEntity, withEntities } from '@ngrx/signals/entities';
import { UserContact } from '@plastik/core/entities';
import {
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
  status: 'ACTIVE' | 'DONE' | 'EXPIRED';
  expiredAt: Date | null;
  orderCycle: string | null;
  notes: string | null;
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
};

export const ecoStoreCartStore = signalStore(
  { providedIn: 'root' },
  withDevtools('cart'),
  withState<EcoStoreCartState>(initialState),
  withEntities<CartItem>(),
  withStorageSync({
    key: 'eco_cart_v1',
    autoSync: true,
  }),

  withComputed(({ entities, entityMap }) => ({
    itemsCount: computed(() => entities().length),
    totalAmount: computed(() =>
      entities().reduce((acc, item) => acc + item.quantity * item.product.price, 0)
    ),
    totalAmountWithIva: computed(() =>
      entities().reduce((acc, item) => acc + item.quantity * item.product.priceWithIva, 0)
    ),
    isEmpty: computed(() => entities().length === 0),
    itemsDictionary: computed(() => entityMap()),
    items: computed(() => entities()),
    itemsGroupedByCategory: computed(() => {
      return Object.groupBy(entities(), (item: CartItem) => item.product.categoryName);
    }),
  })),

  withComputed(({ totalAmount, totalAmountWithIva, shipping }) => ({
    totalAmountIva: computed(() => totalAmountWithIva() - totalAmount()),
    totalAmountWithShipping: computed(() => totalAmountWithIva() + shipping()),
  })),

  withMethods(store => {
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
          return;
        }

        _setItem(product, quantity, !!existingItem);
      },

      removeFromCart(productId: EcoStoreProductWithCategoryName['id']) {
        _removeItem(productId);
      },

      clearCart() {
        updateState(store, '[cart] clear cart', removeAllEntities());
      },

      updateLogistics(logistics: Partial<EcoStoreCartState>) {
        updateState(store, '[Cart] Update Logistics', state => ({
          ...state,
          ...logistics,
        }));
      },
    };
  })
);
