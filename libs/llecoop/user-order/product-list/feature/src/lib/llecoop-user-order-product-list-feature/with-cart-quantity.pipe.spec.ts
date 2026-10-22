import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

import { WithCartQuantityPipe } from './with-cart-quantity.pipe';

describe('WithCartQuantityPipe', () => {
  let pipe: WithCartQuantityPipe;
  const mockCartSignal = signal<LlecoopProductWithQuantity[]>([]);

  const mockProduct1 = {
    id: 'prod-1',
    name: 'Product 1',
    price: 10,
    iva: 10,
    priceWithIva: 11,
    isAvailable: true,
    unit: { type: 'unit' },
  } as LlecoopProduct;

  const mockProduct2 = {
    id: 'prod-2',
    name: 'Product 2',
    price: 20,
    iva: 10,
    priceWithIva: 22,
    isAvailable: true,
    unit: { type: 'unit' },
  } as LlecoopProduct;

  beforeEach(() => {
    mockCartSignal.set([]);

    TestBed.configureTestingModule({
      providers: [
        WithCartQuantityPipe,
        {
          provide: llecoopUserOrderCartStore,
          useValue: {
            cart: mockCartSignal,
          },
        },
      ],
    });

    pipe = TestBed.inject(WithCartQuantityPipe);
  });

  it('should return empty array when products input is empty or null/undefined', () => {
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform(null as unknown as LlecoopProduct[])).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('should return products with quantity 0 when cart is empty', () => {
    mockCartSignal.set([]);
    const result = pipe.transform([mockProduct1, mockProduct2]);

    expect(result).toEqual([
      { ...mockProduct1, quantity: 0 },
      { ...mockProduct2, quantity: 0 },
    ]);
  });

  it('should map cart item quantities to corresponding products using O(1) Map lookup', () => {
    mockCartSignal.set([
      { ...mockProduct1, quantity: 3 },
    ]);

    const result = pipe.transform([mockProduct1, mockProduct2]);

    expect(result).toEqual([
      { ...mockProduct1, quantity: 3 },
      { ...mockProduct2, quantity: 0 },
    ]);
  });
});
