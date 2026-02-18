import { effect, Signal, signal, WritableSignal } from '@angular/core';

/**
 * @description Trigger a bump animation on the cart when the total changes.
 * @param {object} cartStore - Cart store with subtotal and tax signals.
 * @param {Signal<number>} cartStore.subtotal - Cart subtotal.
 * @param {Signal<number>} cartStore.tax - Cart tax.
 * @returns {WritableSignal<boolean>} - Signal that triggers the bump animation.
 */
export function useCartBumpAnimation(cartStore: {
  subtotal: Signal<number>;
  tax: Signal<number>;
}): WritableSignal<boolean> {
  const bumpAnimation = signal(false);

  effect(() => {
    if (cartStore.subtotal() + cartStore.tax() > 0) {
      bumpAnimation.set(true);
      const timer = setTimeout(() => {
        bumpAnimation.set(false);
        clearTimeout(timer);
      }, 300);
    }
  });

  return bumpAnimation;
}
