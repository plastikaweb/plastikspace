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

  const mockProduct1: LlecoopProductWithQuantity = {
    id: 'prod-1',
    name: 'B Banana',
    price: 10,
    priceWithIva: 12,
    quantity: 2,
    unit: { type: 'unit' },
  } as LlecoopProductWithQuantity;

  const mockProduct2: LlecoopProductWithQuantity = {
    id: 'prod-2',
    name: 'A Apple',
    price: 5,
    priceWithIva: 6,
    quantity: 3,
    unit: { type: 'unit' },
  } as LlecoopProductWithQuantity;

  it('should be created', () => {
    const { store } = setup();

    expect(store).toBeTruthy();
  });

  it('should calculate total cart price correctly', () => {
    const { store } = setup();

    store.addItem(mockProduct1);
    store.addItem(mockProduct2);

    // mockProduct1: 12 * 2 = 24
    // mockProduct2: 6 * 3 = 18
    // Total = 42
    expect(store.getCartTotalPrice()).toBe(42);
  });

  it('should return ordered cart items sorted alphabetically by name without mutating the underlying cart state', () => {
    const { store } = setup();

    store.addItem(mockProduct1); // 'B Banana' added first
    store.addItem(mockProduct2); // 'A Apple' added second

    // Internal cart state keeps original array order ('B Banana', then 'A Apple')
    expect(store.cart()[0].name).toBe('B Banana');
    expect(store.cart()[1].name).toBe('A Apple');

    const orderedItems = store.getOrderedCartItems();

    // Sorted output order ('A Apple', then 'B Banana')
    expect(orderedItems[0].name).toBe('A Apple');
    expect(orderedItems[1].name).toBe('B Banana');

    // Verify the cart signal array was not mutated in-place
    expect(store.cart()[0].name).toBe('B Banana');
    expect(store.cart()[1].name).toBe('A Apple');
  });
});
