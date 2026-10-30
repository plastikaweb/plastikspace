import './test-setup';

import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  const mockAuthService = {
    currentUser: vi.fn().mockReturnValue(null),
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        llecoopUserOrderCartStore,
        {
          provide: FirebaseAuthService,
          useValue: mockAuthService,
        },
      ],
    });

    return { store: TestBed.inject(llecoopUserOrderCartStore) };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const mockItem1: LlecoopProductWithQuantity = {
    id: '1',
    name: 'Banana',
    priceWithIva: 2.5,
    quantity: 3,
  } as LlecoopProductWithQuantity;

  const mockItem2: LlecoopProductWithQuantity = {
    id: '2',
    name: 'Apple',
    priceWithIva: 1.25,
    quantity: 2,
  } as LlecoopProductWithQuantity;

  it('should be created and initialized with empty cart', () => {
    const { store } = setup();

    expect(store).toBeTruthy();
    expect(store.cart()).toEqual([]);
    expect(store.getCartTotalPrice()).toBe(0);
    expect(store.getOrderedCartItems()).toEqual([]);
  });

  it('should calculate getCartTotalPrice accurately without floating point precision errors', () => {
    const { store } = setup();

    store.addItem(mockItem1);
    store.addItem(mockItem2);

    // 2.5 * 3 = 7.5; 1.25 * 2 = 2.5; Total = 10
    expect(store.getCartTotalPrice()).toBe(10);
  });

  it('should round getCartTotalPrice to 2 decimal places properly', () => {
    const { store } = setup();

    const decimalItem: LlecoopProductWithQuantity = {
      id: '3',
      name: 'Cherry',
      priceWithIva: 1.333,
      quantity: 3,
    } as LlecoopProductWithQuantity;

    store.addItem(decimalItem);
    // 1.333 * 3 = 3.999 -> rounded to 4
    expect(store.getCartTotalPrice()).toBe(4);
  });

  it('should return getOrderedCartItems sorted alphabetically without mutating original cart state array', () => {
    const { store } = setup();

    store.addItem(mockItem1); // 'Banana'
    store.addItem(mockItem2); // 'Apple'

    const originalCartBefore = [...store.cart()];
    const orderedItems = store.getOrderedCartItems();

    expect(orderedItems[0].name).toBe('Apple');
    expect(orderedItems[1].name).toBe('Banana');

    // Ensure original store cart array order is preserved and not mutated in place
    expect(store.cart()[0].name).toBe(originalCartBefore[0].name);
    expect(store.cart()[1].name).toBe(originalCartBefore[1].name);
  });

  it('should fast-path getOrderedCartItems for empty or 1 item carts', () => {
    const { store } = setup();

    expect(store.getOrderedCartItems()).toEqual([]);

    store.addItem(mockItem1);
    const singleItemOrdered = store.getOrderedCartItems();

    expect(singleItemOrdered.length).toBe(1);
    expect(singleItemOrdered[0].name).toBe('Banana');
  });
});
