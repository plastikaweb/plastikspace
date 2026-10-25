import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

import { WithCartQuantityPipe } from './with-cart-quantity.pipe';

describe('WithCartQuantityPipe', () => {
  let pipe: WithCartQuantityPipe;
  let cartSignal: ReturnType<typeof signal<LlecoopProductWithQuantity[]>>;

  const mockProducts: LlecoopProduct[] = [
    {
      id: 'prod-1',
      name: 'Product 1',
      price: 10,
      vat: 21,
      priceWithIva: 12.1,
      unit: { type: 'unit' },
      categoryId: 'cat-1',
      producerId: 'prod-1',
      available: true,
    },
    {
      id: 'prod-2',
      name: 'Product 2',
      price: 20,
      vat: 21,
      priceWithIva: 24.2,
      unit: { type: 'unit' },
      categoryId: 'cat-1',
      producerId: 'prod-1',
      available: true,
    },
  ];

  beforeEach(() => {
    cartSignal = signal<LlecoopProductWithQuantity[]>([]);

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

  it('should return empty array when products is empty or null/undefined', () => {
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform(null as unknown as LlecoopProduct[])).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('should return products with quantity 0 when cart is empty', () => {
    cartSignal.set([]);

    const result = pipe.transform(mockProducts);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ ...mockProducts[0], quantity: 0 });
    expect(result[1]).toEqual({ ...mockProducts[1], quantity: 0 });
  });

  it('should map matching cart quantities to products using Map lookup', () => {
    cartSignal.set([
      { ...mockProducts[0], quantity: 3 },
    ]);

    const result = pipe.transform(mockProducts);

    expect(result).toHaveLength(2);
    expect(result[0].quantity).toBe(3);
    expect(result[1].quantity).toBe(0);
  });

  it('should update output when cart signal changes', () => {
    cartSignal.set([{ ...mockProducts[0], quantity: 2 }]);
    expect(pipe.transform(mockProducts)[0].quantity).toBe(2);

    cartSignal.set([{ ...mockProducts[0], quantity: 5 }]);
    expect(pipe.transform(mockProducts)[0].quantity).toBe(5);
  });
});
