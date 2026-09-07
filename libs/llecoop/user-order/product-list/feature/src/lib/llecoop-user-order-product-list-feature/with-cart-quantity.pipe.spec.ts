import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';
import { WithCartQuantityPipe } from './with-cart-quantity.pipe';

describe('WithCartQuantityPipe', () => {
  let pipe: WithCartQuantityPipe;
  const mockCart = signal<{ id: string; quantity: number }[]>([]);

  beforeEach(() => {
    mockCart.set([]);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        WithCartQuantityPipe,
        {
          provide: llecoopUserOrderCartStore,
          useValue: {
            cart: mockCart,
          },
        },
      ],
    });

    pipe = TestBed.inject(WithCartQuantityPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if input products is empty, null or undefined', () => {
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform(undefined as unknown as LlecoopProduct[])).toEqual([]);
  });

  it('should map cart quantities correctly to matching product IDs', () => {
    mockCart.set([
      { id: 'p1', quantity: 3 },
      { id: 'p3', quantity: 5 },
    ]);

    const products = [
      { id: 'p1', name: 'Product 1' },
      { id: 'p2', name: 'Product 2' },
      { id: 'p3', name: 'Product 3' },
    ] as LlecoopProduct[];

    const result = pipe.transform(products);

    expect(result).toEqual([
      { id: 'p1', name: 'Product 1', quantity: 3 },
      { id: 'p2', name: 'Product 2', quantity: 0 },
      { id: 'p3', name: 'Product 3', quantity: 5 },
    ]);
  });
});
