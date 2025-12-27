import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { updateState, withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { removeAllEntities, removeEntity, setEntity, withEntities } from '@ngrx/signals/entities';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';

export interface CartItem {
  id: string;
  product: EcoStoreProductWithCategoryName;
  quantity: number;
}

export const ecoStoreCartStore = signalStore(
  { providedIn: 'root' },
  withDevtools('cart'),
  withEntities<CartItem>(),
  withStorageSync({
    key: 'eco_cart_v1',
    autoSync: true,
  }),

  withComputed(({ entities, entityMap }) => ({
    itemsCount: computed(() => entities().length),
    totalAmount: computed(() =>
      entities().reduce((acc, item) => acc + item.quantity * item.product.priceWithIva, 0)
    ),
    isEmpty: computed(() => entities().length === 0),
    itemsDictionary: computed(() => entityMap()),
    items: computed(() => entities()),
  })),
  withMethods(store => {
    const _setItem = (product: EcoStoreProductWithCategoryName, quantity: number) => {
      updateState(
        store,
        `add item ${product.id}`,
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

        _setItem(product, quantity);
      },

      removeFromCart(productId: EcoStoreProductWithCategoryName['id']) {
        _removeItem(productId);
      },

      clearCart() {
        updateState(store, '[cart] clear cart', removeAllEntities());
      },
    };
  })
);
