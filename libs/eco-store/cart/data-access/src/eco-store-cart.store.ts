import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import type { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';

export interface CartItem {
  product: EcoStoreProductWithCategoryName;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const ecoStoreCartStore = signalStore(
  { providedIn: 'root' },
  withDevtools('cart'),
  withState(initialState),
  withStorageSync({
    key: 'eco_cart_v1',
    autoSync: true,
  }),

  withComputed(({ items }) => ({
    itemsCount: computed(() => items().reduce((acc, item) => acc + item.quantity, 0)),
    totalAmount: computed(() =>
      items().reduce((acc, item) => acc + item.quantity * item.product.price, 0)
    ),
    isEmpty: computed(() => items().length === 0),
  })),
  withMethods(store => {
    const _addItem = (product: EcoStoreProductWithCategoryName, quantity: number) => {
      updateState(store, `[cart] addItem ${product.id}`, {
        items: [...store.items(), { product, quantity }],
      });
    };

    const _updateItem = (productId: string, quantity: number) => {
      updateState(store, `[cart] updateItem ${productId}`, {
        items: store
          .items()
          .map(item => (item.product.id === productId ? { ...item, quantity } : item)),
      });
    };

    const _removeItem = (productId: string) => {
      updateState(store, `[cart] removeItem ${productId}`, {
        items: store.items().filter(item => item.product.id !== productId),
      });
    };

    return {
      addToCart: (product: EcoStoreProductWithCategoryName, quantity = 1) => {
        const existingItem = store.items().find(item => item.product.id === product.id);

        if (quantity <= 0) {
          if (existingItem) _removeItem(product.id);
          return;
        }

        if (existingItem) {
          _updateItem(product.id, quantity);
        } else {
          _addItem(product, quantity);
        }
      },

      removeFromCart: (productId: string) => _removeItem(productId),

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          _removeItem(productId);
          return;
        }
        _updateItem(productId, quantity);
      },

      clearCart: () => updateState(store, '[cart] clearCart', { items: [] }),
    };
  })
);
