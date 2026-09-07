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
    // Build an O(1) Map lookup of product id to cart quantity to avoid O(N * M) nested array searches
    const cartQuantityMap = new Map<string, number>();
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item && item.id) {
        cartQuantityMap.set(item.id, item.quantity ?? 0);
      }
    }

    return products.map(product => ({
      ...product,
      quantity: cartQuantityMap.get(product.id) ?? 0,
    }));
  }
}
