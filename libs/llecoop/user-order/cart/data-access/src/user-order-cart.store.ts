import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { map, pipe } from 'rxjs';

export const initState = {
  cart: [] as LlecoopProductWithQuantity[],
};

export const CART_STORAGE_KEY = 'llecoop_user_cart';

export const llecoopUserOrderCartStore = signalStore(
  { providedIn: 'root' },
  withDevtools('user-order-cart'),
  withState(initState),
  withProps(() => ({
    _authService: inject(FirebaseAuthService),
  })),
  withComputed(({ cart }) => ({
    getCartTotalPrice: computed(() =>
      cart().reduce((acc, cartItem) => Number((acc + cartItem.priceWithIva * cartItem.quantity).toFixed(2)), 0)
    ),
    getOrderedCartItems: computed(() => [...cart()].sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))),
  })),
  withMethods(store => {
    return {
      addItem: rxMethod<LlecoopProductWithQuantity>(
        pipe(
          map(({ quantity, ...product }) => {
            const currentCart = store.cart().filter(cartItem => cartItem.id !== product.id);

            updateState(store, `[user-order-cart] add item`, {
              cart: quantity === 0 ? currentCart : [...currentCart, { ...product, quantity: Number(quantity) }],
            });
          })
        )
      ),

      persistCartData: (cartData: LlecoopProductWithQuantity[]) => {
        const userId = store._authService.currentUser()?.uid;

        if (!userId) {
          localStorage.setItem(
            `${CART_STORAGE_KEY}_${userId || 'anonymous'}`,
            JSON.stringify(cartData)
          );

          return;
        }
      },

      loadPersistedCart: () => {
        const userId = store._authService.currentUser()?.uid;
        const storedCart = localStorage.getItem(`${CART_STORAGE_KEY}_${userId || 'anonymous'}`);

        if (storedCart) {
          try {
            const parsedCart = JSON.parse(storedCart);

            updateState(store, `[user-order-cart] load persisted cart`, {
              cart: parsedCart,
            });
          } catch {
            // console.error('Error al cargar el carrito desde localStorage:', error);
          }
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadPersistedCart();

      effect(() => {
        store.persistCartData(store.cart());
      });
    },
  })
);
