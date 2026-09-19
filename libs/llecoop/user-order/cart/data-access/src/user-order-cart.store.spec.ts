import '@angular/compiler';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  let store: InstanceType<typeof llecoopUserOrderCartStore>;

  const mockAuthService = {
    currentUser: signal(null),
  };

  const itemA: LlecoopProductWithQuantity = {
    id: '1',
    name: 'Banana',
    priceWithIva: 1.5,
    quantity: 2,
  } as LlecoopProductWithQuantity;

  const itemB: LlecoopProductWithQuantity = {
    id: '2',
    name: 'Apple',
    priceWithIva: 2.25,
    quantity: 3,
  } as LlecoopProductWithQuantity;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        llecoopUserOrderCartStore,
        { provide: FirebaseAuthService, useValue: mockAuthService },
      ],
    });

    store = TestBed.inject(llecoopUserOrderCartStore);
  });

  it('should compute getCartTotalPrice accurately', () => {
    expect(store.getCartTotalPrice()).toBe(0);

    store.addItem(itemA);
    store.addItem(itemB);

    // 1.5 * 2 + 2.25 * 3 = 3.00 + 6.75 = 9.75
    expect(store.getCartTotalPrice()).toBe(9.75);
  });

  it('should return getOrderedCartItems sorted alphabetically without mutating the original cart array', () => {
    store.addItem(itemA); // Banana
    store.addItem(itemB); // Apple

    const originalCartBefore = store.cart();
    const orderedItems = store.getOrderedCartItems();

    expect(orderedItems[0].name).toBe('Apple');
    expect(orderedItems[1].name).toBe('Banana');

    // Original cart state array reference should preserve original insertion order and not be mutated
    expect(store.cart()[0].name).toBe('Banana');
    expect(store.cart()[1].name).toBe('Apple');
    expect(store.cart()).toBe(originalCartBefore);
  });
});
