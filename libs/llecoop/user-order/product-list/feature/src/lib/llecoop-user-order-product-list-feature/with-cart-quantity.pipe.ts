import { Pipe, PipeTransform, inject } from '@angular/core';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

/**
 * Pipe to add the quantity of products currently in the user's cart to a list of products.
 */
@Pipe({
  name: 'withCartQuantity',
  pure: false,
})
export class WithCartQuantityPipe implements PipeTransform {
  readonly #cartStore = inject(llecoopUserOrderCartStore);

  /**
   * Transforms a product list by enriching each product with its quantity in the cart.
   * Fast-paths empty input/cart lists and uses a Map lookup for O(N + M) performance on change detection runs.
   * @param {LlecoopProduct[]} products - The list of products to enrich.
   * @returns {LlecoopProductWithQuantity[]} The enriched product list containing cart quantities.
   */
  transform(products: LlecoopProduct[] = []): LlecoopProductWithQuantity[] {
    if (!products?.length) {
      return [];
    }

    const cartItems = this.#cartStore.cart();

    if (!cartItems?.length) {
      return products.map(product => ({
        ...product,
        quantity: 0,
      }));
    }

    // Performance Optimization: Construct an O(1) lookup map of cart quantities.
    // Replaces O(N * M) nested `.find()` with O(N + M) complexity on every change detection cycle (pure: false).
    const cartQuantityMap = new Map<string, number>(
      cartItems.map(cartItem => [cartItem.id, cartItem.quantity])
    );

    return products.map(product => ({
      ...product,
      quantity: cartQuantityMap.get(product.id) ?? 0,
    }));
  }
}
