import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  let store: InstanceType<typeof llecoopUserOrderCartStore>;
  let fakeAuthService: Partial<FirebaseAuthService>;

  beforeEach(() => {
    fakeAuthService = {
      currentUser: () => null,
    } as unknown as Partial<FirebaseAuthService>;

    TestBed.configureTestingModule({
      providers: [
        llecoopUserOrderCartStore,
        { provide: FirebaseAuthService, useValue: fakeAuthService },
      ],
    });

    store = TestBed.inject(llecoopUserOrderCartStore);
  });

  it('should initialize with empty cart', () => {
    expect(store.cart()).toEqual([]);
    expect(store.getCartTotalPrice()).toBe(0);
    expect(store.getOrderedCartItems()).toEqual([]);
  });

  it('should compute getCartTotalPrice correctly', () => {
    const item1: LlecoopProductWithQuantity = {
      id: '1',
      name: 'Orange',
      priceWithIva: 2.5,
      quantity: 2,
    } as LlecoopProductWithQuantity;

    const item2: LlecoopProductWithQuantity = {
      id: '2',
      name: 'Apple',
      priceWithIva: 1.25,
      quantity: 4,
    } as LlecoopProductWithQuantity;

    store.addItem(item1);
    store.addItem(item2);

    // (2.5 * 2) + (1.25 * 4) = 5.0 + 5.0 = 10.0
    expect(store.getCartTotalPrice()).toBe(10);
  });

  it('should compute getOrderedCartItems sorted alphabetically by name without mutating original cart signal', () => {
    const item1: LlecoopProductWithQuantity = {
      id: '1',
      name: 'Zucchini',
      priceWithIva: 3,
      quantity: 1,
    } as LlecoopProductWithQuantity;

    const item2: LlecoopProductWithQuantity = {
      id: '2',
      name: 'Avocado',
      priceWithIva: 2,
      quantity: 1,
    } as LlecoopProductWithQuantity;

    const item3: LlecoopProductWithQuantity = {
      id: '3',
      name: 'Banana',
      priceWithIva: 1.5,
      quantity: 1,
    } as LlecoopProductWithQuantity;

    store.addItem(item1);
    store.addItem(item2);
    store.addItem(item3);

    const originalCartBeforeComputed = store.cart();

    expect(originalCartBeforeComputed.map(i => i.name)).toEqual(['Zucchini', 'Avocado', 'Banana']);

    const orderedItems = store.getOrderedCartItems();

    expect(orderedItems.map(i => i.name)).toEqual(['Avocado', 'Banana', 'Zucchini']);

    // Ensure original signal array order remained unchanged and was not mutated in place
    expect(store.cart().map(i => i.name)).toEqual(['Zucchini', 'Avocado', 'Banana']);
  });
});
