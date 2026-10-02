import { Pipe, PipeTransform, inject } from '@angular/core';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

@Pipe({
  name: 'withCartQuantity',
  pure: false,
})
/**
 * This pipe is used to add the quantity of the product in the cart to the products list.
 * It is used in the product list feature component.
 */
export class WithCartQuantityPipe implements PipeTransform {
  readonly #cartStore = inject(llecoopUserOrderCartStore);

  #lastProducts: LlecoopProduct[] | null = null;
  #lastCart: LlecoopProductWithQuantity[] | null = null;
  #lastResult: LlecoopProductWithQuantity[] = [];

  transform(products: LlecoopProduct[] = []): LlecoopProductWithQuantity[] {
    if (!products?.length) {
      this.#lastProducts = null;
      this.#lastCart = null;
      this.#lastResult = [];

      return [];
    }

    const cartItems = this.#cartStore.cart();

    // Fast-path O(1) memoization: return previous array reference if neither products nor cart changed
    if (this.#lastProducts === products && this.#lastCart === cartItems) {
      return this.#lastResult;
    }

    // Build O(M) lookup map of product ID to quantity
    const quantityMap = new Map<string, number>();

    for (let i = 0; i < cartItems.length; i++) {
      const cartProduct = cartItems[i];

      if (cartProduct && cartProduct.id) {
        quantityMap.set(cartProduct.id, cartProduct.quantity);
      }
    }

    // Map products to product with quantity in O(N)
    const result = products.map(product => {
      const quantity = quantityMap.get(product.id) ?? 0;

      return {
        ...product,
        quantity,
      };
    });

    this.#lastProducts = products;
    this.#lastCart = cartItems;
    this.#lastResult = result;

    return result;
  }
}
