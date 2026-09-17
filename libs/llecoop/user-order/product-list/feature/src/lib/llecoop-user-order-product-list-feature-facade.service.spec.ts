import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LlecoopProduct, LlecoopUserOrderCartItem } from '@plastik/llecoop/entities';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';
import { llecoopUserOrderProductStore } from '@plastik/llecoop/user-order-product-list/data-access';
import { LlecoopUserOrderProductListFeatureFacadeService } from './llecoop-user-order-product-list-feature-facade.service';
import { LlecoopUserOrderProductListFeatureSearchFormConfig } from './llecoop-user-order-product-list-feature-search-form.config';

describe('LlecoopUserOrderProductListFeatureFacadeService', () => {
  let service: LlecoopUserOrderProductListFeatureFacadeService;

  const mockEntitiesSignal = signal<LlecoopProduct[]>([]);
  const mockCartSignal = signal<LlecoopUserOrderCartItem[]>([]);
  const mockCountSignal = signal<number>(0);
  const mockPaginationSignal = signal<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 10,
  });
  const mockFilterSignal = signal({});

  const mockProductStore = {
    entities: mockEntitiesSignal,
    count: mockCountSignal,
    pagination: mockPaginationSignal,
    filter: mockFilterSignal,
  };

  const mockCartStore = {
    cart: mockCartSignal,
    addItem: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockSearchFormConfig = {
    getConfig: vi.fn().mockReturnValue([]),
  };

  beforeEach(() => {
    mockEntitiesSignal.set([]);
    mockCartSignal.set([]);

    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderProductListFeatureFacadeService,
        { provide: llecoopUserOrderProductStore, useValue: mockProductStore },
        { provide: llecoopUserOrderCartStore, useValue: mockCartStore },
        { provide: Router, useValue: mockRouter },
        {
          provide: LlecoopUserOrderProductListFeatureSearchFormConfig,
          useValue: mockSearchFormConfig,
        },
      ],
    });

    service = TestBed.inject(LlecoopUserOrderProductListFeatureFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('productsWithQuantity', () => {
    it('should return empty array when products are empty', () => {
      expect(service.productsWithQuantity()).toEqual([]);
    });

    it('should merge product entities with quantities from cart store', () => {
      const product1 = { id: 'p1', name: 'Apple', priceWithIva: 2.5 } as LlecoopProduct;
      const product2 = { id: 'p2', name: 'Banana', priceWithIva: 1.5 } as LlecoopProduct;

      mockEntitiesSignal.set([product1, product2]);
      mockCartSignal.set([
        { id: 'p1', name: 'Apple', quantity: 3 } as LlecoopUserOrderCartItem,
      ]);

      const result = service.productsWithQuantity();

      expect(result).toEqual([
        { id: 'p1', name: 'Apple', priceWithIva: 2.5, quantity: 3 },
        { id: 'p2', name: 'Banana', priceWithIva: 1.5, quantity: 0 },
      ]);
    });

    it('should reactively update when cart items change', () => {
      const product1 = { id: 'p1', name: 'Apple', priceWithIva: 2.5 } as LlecoopProduct;
      mockEntitiesSignal.set([product1]);
      mockCartSignal.set([]);

      expect(service.productsWithQuantity()).toEqual([
        { id: 'p1', name: 'Apple', priceWithIva: 2.5, quantity: 0 },
      ]);

      mockCartSignal.set([
        { id: 'p1', name: 'Apple', quantity: 5 } as LlecoopUserOrderCartItem,
      ]);

      expect(service.productsWithQuantity()).toEqual([
        { id: 'p1', name: 'Apple', priceWithIva: 2.5, quantity: 5 },
      ]);
    });
  });
});
