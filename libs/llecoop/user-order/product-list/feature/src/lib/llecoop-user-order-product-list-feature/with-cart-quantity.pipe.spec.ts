import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

import { WithCartQuantityPipe } from './with-cart-quantity.pipe';

describe('WithCartQuantityPipe', () => {
  let pipe: WithCartQuantityPipe;
  const cartSignal = signal<LlecoopProductWithQuantity[]>([]);

  beforeEach(() => {
    cartSignal.set([]);

    TestBed.configureTestingModule({
      providers: [
        WithCartQuantityPipe,
        {
          provide: llecoopUserOrderCartStore,
          useValue: {
            cart: cartSignal,
          },
        },
      ],
    });

    pipe = TestBed.inject(WithCartQuantityPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if products is empty or nullish', () => {
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform(undefined as unknown as LlecoopProduct[])).toEqual([]);
  });

  it('should map cart quantities to products based on product id', () => {
    const products: LlecoopProduct[] = [
      { id: 'p1', name: 'Product 1', price: 10, isAvailable: true } as LlecoopProduct,
      { id: 'p2', name: 'Product 2', price: 20, isAvailable: true } as LlecoopProduct,
    ];

    cartSignal.set([
      { id: 'p1', name: 'Product 1', price: 10, quantity: 3 } as LlecoopProductWithQuantity,
    ]);

    const result = pipe.transform(products);

    expect(result).toEqual([
      { id: 'p1', name: 'Product 1', price: 10, isAvailable: true, quantity: 3 },
      { id: 'p2', name: 'Product 2', price: 20, isAvailable: true, quantity: 0 },
    ]);
  });
});
