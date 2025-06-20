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
  private readonly cartStore = inject(llecoopUserOrderCartStore);

  transform(products: LlecoopProduct[] = []): LlecoopProductWithQuantity[] {
    if (!products?.length) {
      return [];
    }

    const cartItems = this.cartStore.cart();

    return products.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      return {
        ...product,
        quantity: cartItem?.initQuantity ?? 0,
      };
    });
  }
}
