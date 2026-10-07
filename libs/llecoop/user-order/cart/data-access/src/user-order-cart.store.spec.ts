import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  let store: InstanceType<typeof llecoopUserOrderCartStore>;
  let mockFirebaseAuthService: { currentUser: ReturnType<typeof vi.fn> };

  const mockProductA: LlecoopProductWithQuantity = {
    id: 'prod-1',
    name: 'Zucchini',
    priceWithIva: 2.5,
    quantity: 3,
  } as LlecoopProductWithQuantity;

  const mockProductB: LlecoopProductWithQuantity = {
    id: 'prod-2',
    name: 'Apples',
    priceWithIva: 1.25,
    quantity: 2,
  } as LlecoopProductWithQuantity;

  beforeEach(() => {
    mockFirebaseAuthService = {
      currentUser: vi.fn().mockReturnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        llecoopUserOrderCartStore,
        { provide: FirebaseAuthService, useValue: mockFirebaseAuthService },
      ],
    });

    store = TestBed.inject(llecoopUserOrderCartStore);
  });

  it('should calculate getCartTotalPrice accurately without mutating total in reduce loop', () => {
    expect(store.getCartTotalPrice()).toBe(0);

    store.addItem(mockProductA); // 2.50 * 3 = 7.50
    store.addItem(mockProductB); // 1.25 * 2 = 2.50

    expect(store.getCartTotalPrice()).toBe(10);
  });

  it('should sort cart items by name in getOrderedCartItems without mutating original cart state array', () => {
    store.addItem(mockProductA); // Zucchini
    store.addItem(mockProductB); // Apples

    const originalCartBeforeSort = [...store.cart()];
    const ordered = store.getOrderedCartItems();

    expect(ordered[0].name).toBe('Apples');
    expect(ordered[1].name).toBe('Zucchini');

    // Verify original cart signal array remained unchanged (not mutated in place)
    expect(store.cart()[0].name).toBe(originalCartBeforeSort[0].name);
    expect(store.cart()[1].name).toBe(originalCartBeforeSort[1].name);
  });
});
