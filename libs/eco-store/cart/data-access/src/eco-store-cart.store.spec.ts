import { ecoStoreCartStore } from './eco-store-cart.store';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { TestBed } from '@angular/core/testing';

describe('ecoStoreCartStore', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [ecoStoreCartStore],
    });
    return TestBed.inject(ecoStoreCartStore);
  };

  const mockProduct: EcoStoreProductWithCategoryName = {
    id: '1',
    name: 'Product 1',
    price: 10,
    priceWithIva: 10,
    iva: 0,
    unitBase: 1,
    tenant: '',
    maxQuantity: 300,
    minQuantity: 1,
    category: 'cat1',
    categoryName: 'Category 1',
    stock: 100,
    unitType: 'unit',
    description: 'desc',
    images: ['img.png'],
    created: new Date(),
    updated: new Date(),
    collectionId: 'colId',
    collectionName: 'colName',
    inStock: true,
    categorySlug: 'cat1',
    categoryColor: '',
    features: [],
  };

  it('should be created', () => {
    const store = setup();
    expect(store).toBeTruthy();
  });

  it('should add item to cart', () => {
    const store = setup();
    store.addToCart(mockProduct, 2);

    expect(store.items()[0]).toEqual({ id: '1', product: mockProduct, quantity: 2 });
    expect(store.itemsCount()).toBe(1);
    expect(store.subtotal() + store.tax()).toBe(20);
  });

  it('should update item quantity in cart', () => {
    const store = setup();
    store.addToCart(mockProduct, 1);
    store.addToCart(mockProduct, 3); // Updates to 3

    // Wait, the logic is _setItem which uses setEntity.
    // If I call addToCart(p, 3), does it ADD 3 or SET to 3?
    // Code says: _setItem(product, quantity). setEntity({ ... quantity })
    // So it SETS the quantity.

    expect(store.items()[0].quantity).toBe(3);
    expect(store.itemsCount()).toBe(1);
    expect(store.subtotal() + store.tax()).toBe(30);
  });

  it('should remove item if quantity is <= 0', () => {
    const store = setup();
    store.addToCart(mockProduct, 1);
    store.addToCart(mockProduct, 0);

    expect(store.itemsCount()).toBe(0);
    expect(store.isEmpty()).toBe(true);
  });

  it('should clear cart', () => {
    const store = setup();
    store.addToCart(mockProduct, 1);
    store.clearCart();

    expect(store.itemsCount()).toBe(0);
  });

  it('should get item count via signal', () => {
    const store = setup();
    store.addToCart(mockProduct, 5);

    const countSignal = store.getItemCount('1');
    expect(countSignal()).toBe(5);

    const countSignalEmpty = store.getItemCount('2');
    expect(countSignalEmpty()).toBe(0);
  });
});
