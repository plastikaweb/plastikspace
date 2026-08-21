import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from './user-order-cart.store';

describe('llecoopUserOrderCartStore', () => {
  let store: InstanceType<typeof llecoopUserOrderCartStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

  describe('getCartTotalPrice', () => {
    it('should return 0 when cart is empty', () => {
      expect(store.getCartTotalPrice()).toBe(0);
    });

    it('should correctly calculate total price rounded to 2 decimal places', () => {
      const mockItems: LlecoopProductWithQuantity[] = [
        {
          id: '1',
          name: 'Apples',
          priceWithIva: 1.25,
          quantity: 3,
        } as LlecoopProductWithQuantity,
        {
          id: '2',
          name: 'Bananas',
          priceWithIva: 0.85,
          quantity: 2,
        } as LlecoopProductWithQuantity,
      ];

      store.addItem(mockItems[0]);
      store.addItem(mockItems[1]);

      // 1.25 * 3 = 3.75; 0.85 * 2 = 1.70; Total = 5.45
      expect(store.getCartTotalPrice()).toBe(5.45);
    });
  });

  describe('getOrderedCartItems', () => {
    it('should return cart items sorted alphabetically by name', () => {
      const itemB = { id: '1', name: 'Bananas', priceWithIva: 1, quantity: 1 } as LlecoopProductWithQuantity;
      const itemA = { id: '2', name: 'Apples', priceWithIva: 1, quantity: 1 } as LlecoopProductWithQuantity;

      store.addItem(itemB);
      store.addItem(itemA);

      const sorted = store.getOrderedCartItems();
      expect(sorted[0].name).toBe('Apples');
      expect(sorted[1].name).toBe('Bananas');
    });
  });
});
