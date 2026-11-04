import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { CART_STORAGE_KEY, llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  let store: InstanceType<typeof llecoopUserOrderCartStore>;
  const mockUser = signal<{ uid: string } | null>({ uid: 'user-1' });

  const mockProductA: LlecoopProductWithQuantity = {
    id: 'prod-a',
    name: 'Zebra Apple',
    priceWithIva: 2.5,
    quantity: 2,
  } as LlecoopProductWithQuantity;

  const mockProductB: LlecoopProductWithQuantity = {
    id: 'prod-b',
    name: 'Banana',
    priceWithIva: 1.5,
    quantity: 3,
  } as LlecoopProductWithQuantity;

  beforeEach(() => {
    localStorage.clear();
    mockUser.set({ uid: 'user-1' });

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        llecoopUserOrderCartStore,
        {
          provide: FirebaseAuthService,
          useValue: {
            currentUser: mockUser,
          },
        },
      ],
    });

    store = TestBed.inject(llecoopUserOrderCartStore);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    expect(store.cart()).toEqual([]);
    expect(store.getCartTotalPrice()).toBe(0);
    expect(store.getOrderedCartItems()).toEqual([]);
  });

  it('should calculate total cart price', () => {
    store.addItem(mockProductA);
    store.addItem(mockProductB);

    // Zebra Apple: 2.5 * 2 = 5.0; Banana: 1.5 * 3 = 4.5 -> Total: 9.5
    expect(store.getCartTotalPrice()).toBe(9.5);
  });

  it('should return ordered cart items without mutating signal store cart array in place', () => {
    // Add Zebra Apple first, then Banana second
    store.addItem(mockProductA);
    store.addItem(mockProductB);

    // Original cart array order should be Zebra Apple, then Banana
    const rawCartBefore = store.cart();

    expect(rawCartBefore[0].name).toBe('Zebra Apple');
    expect(rawCartBefore[1].name).toBe('Banana');

    // Access getOrderedCartItems() which should sort alphabetically by name (Banana, then Zebra Apple)
    const ordered = store.getOrderedCartItems();

    expect(ordered[0].name).toBe('Banana');
    expect(ordered[1].name).toBe('Zebra Apple');

    // Verify original cart signal array remained unchanged and was NOT mutated in place
    const rawCartAfter = store.cart();

    expect(rawCartAfter[0].name).toBe('Zebra Apple');
    expect(rawCartAfter[1].name).toBe('Banana');
  });

  it('should remove item when added with quantity 0', () => {
    store.addItem(mockProductA);
    expect(store.cart().length).toBe(1);

    store.addItem({ ...mockProductA, quantity: 0 });

    expect(store.cart().length).toBe(0);
  });

  it('should load persisted cart from localStorage for anonymous user', () => {
    mockUser.set(null);
    const savedCart = [mockProductB];
    localStorage.setItem(`${CART_STORAGE_KEY}_anonymous`, JSON.stringify(savedCart));

    store.loadPersistedCart();

    expect(store.cart()).toEqual(savedCart);
  });
});
