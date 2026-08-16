import { inject, Pipe, PipeTransform } from '@angular/core';
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
    // Build an O(1) lookup Map for cart items to avoid O(N * M) nested loops
    const cartMap = new Map<string, number>();
    for (const item of cartItems) {
      if (item.id) {
        cartMap.set(item.id, item.quantity);
      }
    }

    return products.map(product => ({
      ...product,
      quantity: cartMap.get(product.id) ?? 0,
    }));
  }
}
