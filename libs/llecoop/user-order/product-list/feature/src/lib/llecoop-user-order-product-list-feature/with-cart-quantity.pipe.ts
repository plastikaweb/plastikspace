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

  transform(products: LlecoopProduct[] = []): LlecoopProductWithQuantity[] {
    if (!products?.length) {
      return [];
    }

    const cartItems = this.#cartStore.cart();
    // Build a lookup map of cart quantities indexed by product ID.
    // This reduces the complexity from O(N * M) to O(N + M) on every unpure pipe execution.
    const cartQuantityMap = new Map<string, number>(
      cartItems.map(cartItem => [cartItem.id, cartItem.quantity])
    );

    return products.map(product => ({
      ...product,
      quantity: cartQuantityMap.get(product.id) ?? 0,
    }));
  }
}
