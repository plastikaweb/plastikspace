import { Pipe, PipeTransform, inject } from '@angular/core';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

/**
 * Pipe to attach cart quantities to a list of products.
 */
@Pipe({
  name: 'withCartQuantity',
  pure: false,
})
export class WithCartQuantityPipe implements PipeTransform {
  readonly #cartStore = inject(llecoopUserOrderCartStore);

  /**
   * Transforms an array of products by attaching the corresponding quantity from the cart store.
   * Uses an O(1) Map lookup instead of linear searching to maintain high performance during change detection.
   * @param {LlecoopProduct[]} products List of products to enrich with quantity.
   * @returns {LlecoopProductWithQuantity[]} Array of products with quantity property.
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

    const cartQuantityMap = new Map<string, number>(
      cartItems.map(cartItem => [cartItem.id, cartItem.quantity])
    );

    return products.map(product => ({
      ...product,
      quantity: cartQuantityMap.get(product.id) ?? 0,
    }));
  }
}
