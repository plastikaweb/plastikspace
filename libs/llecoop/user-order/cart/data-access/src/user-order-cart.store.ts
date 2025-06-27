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
      cart().reduce((acc, item) => Number((acc + item.priceWithIva * item.quantity).toFixed(2)), 0)
    ),
    getOrderedCartItems: computed(() => cart().sort((a, b) => a.name.localeCompare(b.name))),
  })),
  withMethods(store => {
    return {
      addItem: rxMethod<LlecoopProductWithQuantity>(
        pipe(
          map(({ quantity, ...product }) => {
            const cart = store.cart().filter(item => item.id !== product.id);

            updateState(store, `[user-order-cart] add item`, {
              cart: quantity === 0 ? cart : [...cart, { ...product, quantity: Number(quantity) }],
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

        // console.log('Datos del carrito sincronizados con Firestore para el usuario:', userId);
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
          } catch (error) {
            //console.error('Error al cargar el carrito desde localStorage:', error);
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
