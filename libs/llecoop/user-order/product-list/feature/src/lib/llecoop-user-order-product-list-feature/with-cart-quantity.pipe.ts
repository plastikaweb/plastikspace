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
    // BOLT OPTIMIZATION: Build a Map of cart quantities indexed by product ID in O(M) time.
    // Replaces O(N * M) nested find calls inside products.map with O(1) Map lookups, reducing total complexity to O(N + M).
    const cartMap = new Map<string, number>(cartItems.map(item => [item.id, item.quantity]));

    return products.map(product => ({
      ...product,
      quantity: cartMap.get(product.id) ?? 0,
    }));
  }
}
