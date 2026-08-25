import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';
import { WithCartQuantityPipe } from './with-cart-quantity.pipe';

describe('WithCartQuantityPipe', () => {
  let pipe: WithCartQuantityPipe;
  const mockCartItems = signal([
    { id: 'prod-1', quantity: 3, name: 'Product 1', priceWithIva: 10 },
    { id: 'prod-3', quantity: 5, name: 'Product 3', priceWithIva: 15 },
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        WithCartQuantityPipe,
        {
          provide: llecoopUserOrderCartStore,
          useValue: {
            cart: mockCartItems,
          },
        },
      ],
    });

    pipe = TestBed.inject(WithCartQuantityPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if products is null, undefined, or empty', () => {
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform(undefined as unknown as LlecoopProduct[])).toEqual([]);
    expect(pipe.transform(null as unknown as LlecoopProduct[])).toEqual([]);
  });

  it('should map products to include cart quantities via O(1) Map lookups', () => {
    const products = [
      { id: 'prod-1', name: 'Product 1' },
      { id: 'prod-2', name: 'Product 2' },
      { id: 'prod-3', name: 'Product 3' },
    ] as LlecoopProduct[];

    const result = pipe.transform(products);

    expect(result).toEqual([
      { id: 'prod-1', name: 'Product 1', quantity: 3 },
      { id: 'prod-2', name: 'Product 2', quantity: 0 },
      { id: 'prod-3', name: 'Product 3', quantity: 5 },
    ]);
  });
});
