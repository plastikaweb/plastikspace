import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreProductsApiService } from '@plastik/eco-store/products/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { of } from 'rxjs';
import { ecoStoreCartStore } from './eco-store-cart.store';
import { EcoStoreCartsApiService } from './eco-store-carts-api.service';

describe('ecoStoreCartStore', () => {
  const setup = () => {
    const mockCartsService = {
      create: vi.fn().mockReturnValue(of({})),
      update: vi.fn().mockReturnValue(of({})),
      getFirstListItem: vi.fn().mockReturnValue(of(null)),
    };

    const mockProductsService = {
      getFullList: vi.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        ecoStoreCartStore,
        { provide: POCKETBASE_INSTANCE, useValue: mockPocketBase },
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
        {
          provide: EcoStoreCartsApiService,
          useValue: mockCartsService,
        },
        {
          provide: EcoStoreProductsApiService,
          useValue: mockProductsService,
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: POCKETBASE_ENVIRONMENT,
          useValue: { production: false, environment: 'test' },
        },
        {
          provide: TranslateService,
          useValue: { instant: vi.fn() },
        },
        {
          provide: LiveAnnouncer,
          useValue: { announce: vi.fn() },
        },
      ],
    });
    return TestBed.inject(ecoStoreCartStore);
  };

  const mockProduct: EcoStoreProductWithCategoryName = {
    id: '1',
    name: 'Product 1',
    price: 10,
    priceWithIva: 10,
    iva: 0,
    unitBase: 1,
    tenant: '',
    maxQuantity: 300,
    minQuantity: 1,
    category: 'cat1',
    categoryName: 'Category 1',
    stock: 100,
    unitType: 'unit',
    description: 'desc',
    images: ['img.png'],
    created: new Date(),
    updated: new Date(),
    collectionId: 'colId',
    collectionName: 'colName',
    inStock: true,
    categorySlug: 'cat1',
    categoryColor: '',
    features: [],
  };

  it('should be created', () => {
    const store = setup();
    expect(store).toBeTruthy();
  });

  it('should add item to cart', () => {
    const store = setup();
    store.addToCart(mockProduct, 2);

    const item = store.items()[0];
    expect(item.quantity).toBe(2);
    expect(item.product.id).toBe(mockProduct.id);
    expect(store.itemsCount()).toBe(1);
    expect(store.subtotal() + store.tax()).toBe(20);
  });

  it('should update item quantity in cart', () => {
    const store = setup();
    store.addToCart(mockProduct, 1);
    store.addToCart(mockProduct, 3); // Updates to 3

    // Wait, the logic is _setItem which uses setEntity.
    // If I call addToCart(p, 3), does it ADD 3 or SET to 3?
    // Code says: _setItem(product, quantity). setEntity({ ... quantity })
    // So it SETS the quantity.

    expect(store.items()[0].quantity).toBe(3);
    expect(store.itemsCount()).toBe(1);
    expect(store.subtotal() + store.tax()).toBe(30);
  });

  it('should remove item if quantity is <= 0', () => {
    const store = setup();
    store.addToCart(mockProduct, 1);
    store.addToCart(mockProduct, 0);

    expect(store.itemsCount()).toBe(0);
    expect(store.isEmpty()).toBe(true);
  });

  it('should clear cart', () => {
    const store = setup();
    store.addToCart(mockProduct, 1);
    store.clearCart();

    expect(store.itemsCount()).toBe(0);
  });

  it('should get item count via signal', () => {
    const store = setup();
    store.addToCart(mockProduct, 5);

    const countSignal = store.getItemCount('1');
    expect(countSignal()).toBe(5);

    const countSignalEmpty = store.getItemCount('2');
    expect(countSignalEmpty()).toBe(0);
  });

  it('should update logistics and reset day/time when address changes', () => {
    const store = setup();
    const mockAddress1 = { id: 'addr1', name: 'Address 1' } as any;
    const mockAddress2 = { id: 'addr2', name: 'Address 2' } as any;

    // Update address
    store.updateLogistics({ address: mockAddress1 });
    // Update day
    store.updateLogistics({ day: 'monday' as any });
    // Update time
    store.updateLogistics({ time: '08:00' as any });

    expect(store.address()?.id).toBe('addr1');
    expect(store.day()).toBe('monday');
    expect(store.time()).toBe('08:00');

    // Change address
    store.updateLogistics({ address: mockAddress2 });

    expect(store.address()?.id).toBe('addr2');
    expect(store.day()).toBeNull();
    expect(store.time()).toBeNull();
  });

  it('should reset time when day changes', () => {
    const store = setup();

    store.updateLogistics({ day: 'monday' as any });
    store.updateLogistics({ time: '08:00' as any });

    expect(store.day()).toBe('monday');
    expect(store.time()).toBe('08:00');

    // Change day
    store.updateLogistics({ day: 'tuesday' as any });

    expect(store.day()).toBe('tuesday');
    expect(store.time()).toBeNull();
  });
});
