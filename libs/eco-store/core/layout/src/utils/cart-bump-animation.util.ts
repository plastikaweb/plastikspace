import { effect, Signal, signal } from '@angular/core';

export function useCartBumpAnimation(cartStore: { subtotal: Signal<number>; tax: Signal<number> }) {
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
