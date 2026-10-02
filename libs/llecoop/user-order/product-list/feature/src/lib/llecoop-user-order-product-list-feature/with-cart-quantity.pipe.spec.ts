import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopProduct, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';

import { WithCartQuantityPipe } from './with-cart-quantity.pipe';

describe('WithCartQuantityPipe', () => {
  let pipe: WithCartQuantityPipe;
  let cartSignal: WritableSignal<LlecoopProductWithQuantity[]>;

  const mockProducts: LlecoopProduct[] = [
    { id: 'p1', name: 'Product 1' } as LlecoopProduct,
    { id: 'p2', name: 'Product 2' } as LlecoopProduct,
  ];

  beforeEach(() => {
    cartSignal = signal<LlecoopProductWithQuantity[]>([]);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
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

  it('should return empty array when products is empty or null', () => {
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform(null as unknown as LlecoopProduct[])).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('should map products with quantities from cart', () => {
    cartSignal.set([{ id: 'p1', name: 'Product 1', quantity: 3 } as LlecoopProductWithQuantity]);

    const result = pipe.transform(mockProducts);

    expect(result).toEqual([
      { id: 'p1', name: 'Product 1', quantity: 3 },
      { id: 'p2', name: 'Product 2', quantity: 0 },
    ]);
  });

  it('should return cached result (same array reference) when neither products nor cart changed', () => {
    cartSignal.set([{ id: 'p1', name: 'Product 1', quantity: 2 } as LlecoopProductWithQuantity]);

    const result1 = pipe.transform(mockProducts);
    const result2 = pipe.transform(mockProducts);

    expect(result1).toBe(result2);
  });

  it('should recalculate when cart signal updates', () => {
    cartSignal.set([{ id: 'p1', name: 'Product 1', quantity: 2 } as LlecoopProductWithQuantity]);

    const result1 = pipe.transform(mockProducts);

    expect(result1[0].quantity).toBe(2);

    cartSignal.set([{ id: 'p1', name: 'Product 1', quantity: 5 } as LlecoopProductWithQuantity]);

    const result2 = pipe.transform(mockProducts);

    expect(result2).not.toBe(result1);
    expect(result2[0].quantity).toBe(5);
  });

  it('should recalculate when products input reference changes', () => {
    cartSignal.set([{ id: 'p1', name: 'Product 1', quantity: 2 } as LlecoopProductWithQuantity]);

    const result1 = pipe.transform(mockProducts);

    const newProducts: LlecoopProduct[] = [
      { id: 'p1', name: 'Product 1 Updated' } as LlecoopProduct,
      { id: 'p2', name: 'Product 2' } as LlecoopProduct,
    ];

    const result2 = pipe.transform(newProducts);

    expect(result2).not.toBe(result1);
    expect(result2[0].name).toBe('Product 1 Updated');
  });
});
