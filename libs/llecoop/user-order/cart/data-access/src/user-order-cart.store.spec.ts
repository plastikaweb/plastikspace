import { TestBed } from '@angular/core/testing';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  let store: InstanceType<typeof llecoopUserOrderCartStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        llecoopUserOrderCartStore,
        {
          provide: FirebaseAuthService,
          useValue: {
            currentUser: () => null,
          },
        },
      ],
    });

    store = TestBed.inject(llecoopUserOrderCartStore);
  });

  it('should initialize with empty cart', () => {
    expect(store.cart()).toEqual([]);
    expect(store.getCartTotalPrice()).toBe(0);
    expect(store.getOrderedCartItems()).toEqual([]);
  });

  it('should calculate total price accurately with single-pass rounding', () => {
    const items: LlecoopProductWithQuantity[] = [
      { id: '1', name: 'Product A', priceWithIva: 10.555, quantity: 2 } as any,
      { id: '2', name: 'Product B', priceWithIva: 5.2, quantity: 3 } as any,
    ];

    updateState(store, 'test set cart', { cart: items });

    // (10.555 * 2 = 21.11) + (5.2 * 3 = 15.6) = 36.71
    expect(store.getCartTotalPrice()).toBe(36.71);
  });

  it('should sort cart items alphabetically without mutating signal state array', () => {
    const items: LlecoopProductWithQuantity[] = [
      { id: '1', name: 'Banana', priceWithIva: 2, quantity: 1 } as any,
      { id: '2', name: 'Apple', priceWithIva: 1, quantity: 1 } as any,
    ];

    updateState(store, 'test set cart', { cart: items });

    const ordered = store.getOrderedCartItems();

    expect(ordered[0].name).toBe('Apple');
    expect(ordered[1].name).toBe('Banana');
    // Ensure state array reference was not mutated or reordered directly
    expect(store.cart()[0].name).toBe('Banana');
    expect(ordered).not.toBe(store.cart());
  });
});
