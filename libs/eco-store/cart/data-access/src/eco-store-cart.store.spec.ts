import { LiveAnnouncer } from '@angular/cdk/a11y';
import '@angular/compiler';
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
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ecoStoreCartStore } from './eco-store-cart.store';
import { EcoStoreCartsApiService } from './eco-store-carts-api.service';

describe('ecoStoreCartStore', () => {
  const mockNotificationService = {
    create: vi.fn(),
  };

  type MockCartsService = {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    getFirstListItem: ReturnType<typeof vi.fn>;
  };

  const mockConfirmService = {
    confirm: vi.fn().mockReturnValue(of(false)),
  };

  const setup = (options?: { cartsServiceOverrides?: Partial<MockCartsService> }) => {
    const mockCartsService: MockCartsService = {
      create: vi.fn().mockReturnValue(of({ id: 'remote-cart-1' })),
      update: vi.fn().mockReturnValue(of({})),
      getFirstListItem: vi.fn().mockReturnValue(of(null)),
      ...options?.cartsServiceOverrides,
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
        {
          provide: StoreNotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: SharedConfirmDialogService,
          useValue: mockConfirmService,
        },
      ],
    });
    return { store: TestBed.inject(ecoStoreCartStore), mockCartsService, mockProductsService };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirmService.confirm.mockReturnValue(of(false));
    mockPocketBaseUserProfileStore.isAuthenticated.set(false);
    mockPocketBaseUserProfileStore.user.set(null);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

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
    const { store } = setup();
    expect(store).toBeTruthy();
  });

  it('should add item to cart', () => {
    const { store } = setup();
    store.addToCart(mockProduct, 2);

    const item = store.items()[0];
    expect(item.quantity).toBe(2);
    expect(item.product.id).toBe(mockProduct.id);
    expect(store.itemsCount()).toBe(1);
    expect(store.subtotal() + store.tax()).toBe(20);
  });

  it('should update item quantity in cart', () => {
    const { store } = setup();
    store.addToCart(mockProduct, 1);
    store.addToCart(mockProduct, 3); // Updates to 3

    expect(store.items()[0].quantity).toBe(3);
    expect(store.itemsCount()).toBe(1);
    expect(store.subtotal() + store.tax()).toBe(30);
  });

  it('should remove item if quantity is <= 0', () => {
    const { store } = setup();
    store.addToCart(mockProduct, 1);
    store.addToCart(mockProduct, 0);

    expect(store.itemsCount()).toBe(0);
    expect(store.isEmpty()).toBe(true);
  });

  it('should clear cart', () => {
    const { store } = setup();
    store.addToCart(mockProduct, 1);
    store.clearCart();

    expect(store.itemsCount()).toBe(0);
  });

  it('should get item count via signal', () => {
    const { store } = setup();
    store.addToCart(mockProduct, 5);

    const countSignal = store.getItemCount('1');
    expect(countSignal()).toBe(5);

    const countSignalEmpty = store.getItemCount('2');
    expect(countSignalEmpty()).toBe(0);
  });

  it('should update logistics and reset day/time when address changes', () => {
    const { store } = setup();
    const mockAddress1 = { id: 'addr1', name: 'Address 1' } as any;
    const mockAddress2 = { id: 'addr2', name: 'Address 2' } as any;

    // Cart must have items, otherwise _recalculatePrices() resets logistics state.
    store.addToCart(mockProduct, 1);
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
    const { store } = setup();

    // Cart must have items, otherwise _recalculatePrices() resets logistics state.
    store.addToCart(mockProduct, 1);
    store.updateLogistics({ day: 'monday' as any });
    store.updateLogistics({ time: '08:00' as any });

    expect(store.day()).toBe('monday');
    expect(store.time()).toBe('08:00');

    // Change day
    store.updateLogistics({ day: 'tuesday' as any });

    expect(store.day()).toBe('tuesday');
    expect(store.time()).toBeNull();
  });

  it('should group items by category', () => {
    const { store } = setup();
    const product2: EcoStoreProductWithCategoryName = {
      ...mockProduct,
      id: '2',
      category: 'cat2',
      categoryName: 'Category 2',
    };

    store.addToCart(mockProduct, 1);
    store.addToCart(product2, 1);

    const grouped = store.itemsGroupedByCategory();
    expect(grouped.length).toBe(2);
    expect(grouped[0].category).toBe('Category 1');
    expect(grouped[0].items[0].product.id).toBe('1');
    expect(grouped[1].category).toBe('Category 2');
    expect(grouped[1].items[0].product.id).toBe('2');
  });

  it('should return isShippingOk as true if method and address are set and no slots required', () => {
    const { store } = setup();
    const mockAddress = { id: 'addr1', name: 'Address 1' } as any;
    const mockMethod = 'pickup' as any;

    mockEcoStoreTenantStore.getTenantDeliveryOptionSlotsDays.mockReturnValue([]);

    // Cart must have items, otherwise _recalculatePrices() resets logistics state.
    store.addToCart(mockProduct, 1);
    store.updateLogistics({ address: mockAddress, method: mockMethod });

    expect(store.isShippingOk()).toBe(true);
  });

  it('should return isShippingOk as false if slots required but not set', () => {
    const { store } = setup();
    const mockAddress = { id: 'addr1', name: 'Address 1' } as any;
    const mockMethod = 'delivery' as any;

    mockEcoStoreTenantStore.getTenantDeliveryOptionSlotsDays.mockReturnValue(['monday']);

    // Cart must have items, otherwise _recalculatePrices() resets logistics state.
    store.addToCart(mockProduct, 1);
    store.updateLogistics({ address: mockAddress, method: mockMethod });

    expect(store.isShippingOk()).toBe(false);

    // updateLogistics resets time when day changes, so set them in separate calls.
    store.updateLogistics({ day: 'monday' as any });
    store.updateLogistics({ time: { start: '08:00', end: '10:00' } as any });
    expect(store.isShippingOk()).toBe(true);
  });

  it('should reset state when last item is removed', () => {
    const { store } = setup();
    store.addToCart(mockProduct, 1);
    store.updateLogistics({ method: 'pickup' as any });
    expect(store.method()).toBe('pickup');

    store.removeFromCart(mockProduct.id);
    expect(store.itemsCount()).toBe(0);
    expect(store.method()).toBeNull();
  });

  describe('loadAndMergeUserCart', () => {
    const localCartState = {
      ids: [mockProduct.id],
      entityMap: {
        [mockProduct.id]: { product: mockProduct, quantity: 2 },
      },
    };

    beforeEach(() => {
      // _loadAndMergeUserCart short-circuits without an authenticated user.
      mockPocketBaseUserProfileStore.isAuthenticated.set(true);
      mockPocketBaseUserProfileStore.user.set({ id: 'user-1' } as any);
    });

    it('should save localStorage items to PocketBase when no remote cart exists', async () => {
      localStorage.setItem('test-tenant-cart-v1', JSON.stringify(localCartState));

      const { store, mockCartsService } = setup();

      await store.loadAndMergeUserCart();

      expect(mockCartsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              product: expect.objectContaining({ id: mockProduct.id }),
              quantity: 2,
            }),
          ]),
        })
      );
      expect(localStorage.getItem('test-tenant-cart-v1')).toBeNull();
    });

    it('should merge localStorage items with existing remote cart', async () => {
      const remoteProduct: EcoStoreProductWithCategoryName = {
        ...mockProduct,
        id: 'remote-product',
        name: 'Remote Product',
      };
      const remoteCart = {
        id: 'remote-cart-1',
        items: [{ product: remoteProduct, quantity: 1 }],
        shipping: 0,
        status: 'ACTIVE',
        deliveryMethod: 'pickup',
        address: null,
        day: null,
        time: null,
        notes: null,
      };

      localStorage.setItem('test-tenant-cart-v1', JSON.stringify(localCartState));

      const { store, mockCartsService } = setup({
        cartsServiceOverrides: {
          getFirstListItem: vi.fn().mockReturnValue(of(remoteCart)),
          update: vi.fn().mockReturnValue(of({})),
        },
      });

      await store.loadAndMergeUserCart();

      expect(mockCartsService.update).toHaveBeenCalledWith(
        'remote-cart-1',
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ product: expect.objectContaining({ id: mockProduct.id }) }),
            expect.objectContaining({ product: expect.objectContaining({ id: 'remote-product' }) }),
          ]),
        })
      );
      expect(mockConfirmService.confirm).toHaveBeenCalledWith(
        'cart.mergeNotification.title',
        'cart.mergeNotification.message',
        'cart.mergeNotification.ko',
        { label: 'cart.mergeNotification.ok', route: ['/cistella'] },
        null,
        'info'
      );
      expect(localStorage.getItem('test-tenant-cart-v1')).toBeNull();
    });

    it('should sum quantities when the same product exists in both carts', async () => {
      const remoteCart = {
        id: 'remote-cart-1',
        items: [{ product: mockProduct, quantity: 3 }],
        shipping: 0,
        status: 'ACTIVE',
        deliveryMethod: 'pickup',
        address: null,
        day: null,
        time: null,
        notes: null,
      };

      localStorage.setItem('test-tenant-cart-v1', JSON.stringify(localCartState));

      const { store, mockCartsService } = setup({
        cartsServiceOverrides: {
          getFirstListItem: vi.fn().mockReturnValue(of(remoteCart)),
          update: vi.fn().mockReturnValue(of({})),
        },
      });

      await store.loadAndMergeUserCart();

      expect(mockCartsService.update).toHaveBeenCalledWith(
        'remote-cart-1',
        expect.objectContaining({
          items: [expect.objectContaining({ quantity: 5 })], // 3 remote + 2 local
        })
      );
    });

    it('should not call PocketBase and not clear localStorage when both sources are empty', async () => {
      const { store, mockCartsService } = setup();

      await store.loadAndMergeUserCart();

      expect(mockCartsService.create).not.toHaveBeenCalled();
      expect(mockCartsService.update).not.toHaveBeenCalled();
      expect(localStorage.getItem('test-tenant-cart-v1')).toBeNull();
    });

    it('should show price update notification when product price changed', async () => {
      const updatedProduct = { ...mockProduct, priceWithIva: 15, price: 12 };
      localStorage.setItem('test-tenant-cart-v1', JSON.stringify(localCartState));

      const { store } = setup({
        cartsServiceOverrides: {
          getFirstListItem: vi.fn().mockReturnValue(of(null)),
          create: vi.fn().mockReturnValue(of({ id: 'new-cart' })),
        },
      });

      // Override products service to return updated prices
      const productsService = TestBed.inject(EcoStoreProductsApiService) as any;
      productsService.getFullList = vi.fn().mockReturnValue(of([updatedProduct]));

      await store.loadAndMergeUserCart();

      expect(mockConfirmService.confirm).toHaveBeenCalledWith(
        'cart.priceUpdatedNotification.title',
        'cart.priceUpdatedNotification.message',
        'cart.priceUpdatedNotification.ko',
        { label: 'cart.priceUpdatedNotification.ok', route: ['/cistella'] },
        null,
        'info'
      );
    });
  });

  describe('logout behavior', () => {
    it('should clear cart entities and localStorage on logout to prevent quantity doubling on next login', async () => {
      // Start logged in with a remote cart
      mockPocketBaseUserProfileStore.isAuthenticated.set(true);
      mockPocketBaseUserProfileStore.user.set({ id: 'user-1' } as any);

      const { store } = setup({
        cartsServiceOverrides: {
          getFirstListItem: vi.fn().mockReturnValue(of(null)),
          create: vi.fn().mockReturnValue(of({ id: 'remote-cart-1' })),
        },
      });

      // Merge populates the store and sets isSynced = true
      await store.loadAndMergeUserCart();
      store.addToCart(mockProduct, 2);

      expect(store.itemsCount()).toBe(1);
      expect(store.isSynced()).toBe(true);

      // Simulate logout — the effect must clear entities and LS
      mockPocketBaseUserProfileStore.isAuthenticated.set(false);
      mockPocketBaseUserProfileStore.user.set(null);
      TestBed.flushEffects();

      expect(store.itemsCount()).toBe(0);
      expect(store.isEmpty()).toBe(true);
      expect(store.isSynced()).toBe(false);
      expect(store.remoteCartId()).toBeNull();
      // LS must be empty — if items were written here they would be doubled on next login
      expect(localStorage.getItem(store.storageKey())).toBeNull();
    });

    it('should not persist cart to localStorage after logout', async () => {
      mockPocketBaseUserProfileStore.isAuthenticated.set(true);
      mockPocketBaseUserProfileStore.user.set({ id: 'user-1' } as any);

      const { store } = setup({
        cartsServiceOverrides: {
          getFirstListItem: vi.fn().mockReturnValue(
            of({
              id: 'remote-cart-1',
              items: [{ product: mockProduct, quantity: 3 }],
              shipping: 0,
              status: 'ACTIVE',
              deliveryMethod: 'pickup',
              address: null,
              day: null,
              time: null,
              notes: null,
            })
          ),
          update: vi.fn().mockReturnValue(of({})),
        },
      });

      await store.loadAndMergeUserCart();
      expect(store.itemsCount()).toBe(1);
      expect(store.items()[0].quantity).toBe(3);

      // Logout
      mockPocketBaseUserProfileStore.isAuthenticated.set(false);
      mockPocketBaseUserProfileStore.user.set(null);
      TestBed.flushEffects();

      // LS must be null — not the 3-item cart that was loaded from PB
      expect(localStorage.getItem(store.storageKey())).toBeNull();
    });
  });

  describe('BUG-004: cart toast notifications (TECH-10 groupKey deduplication)', () => {
    it('announces "added" with a per-product groupKey on first add', () => {
      const { store } = setup();

      store.addToCart(mockProduct, 1);

      expect(mockNotificationService.create).toHaveBeenCalledWith(
        'cart.productAdded',
        'SUCCESS',
        { groupKey: `cart:${mockProduct.id}` },
        expect.objectContaining({ name: mockProduct.name })
      );
    });

    it('announces "updated" (not "added") with the same groupKey when changing an existing quantity', () => {
      const { store } = setup();

      store.addToCart(mockProduct, 1);
      mockNotificationService.create.mockClear();
      store.addToCart(mockProduct, 2);

      expect(mockNotificationService.create).toHaveBeenCalledTimes(1);
      expect(mockNotificationService.create).toHaveBeenCalledWith(
        'cart.productUpdated',
        'SUCCESS',
        { groupKey: `cart:${mockProduct.id}` },
        expect.objectContaining({ name: mockProduct.name })
      );
    });

    it('announces "removed" with the same groupKey so it replaces a prior add/update toast', () => {
      const { store } = setup();

      store.addToCart(mockProduct, 1);
      mockNotificationService.create.mockClear();
      store.removeFromCart(mockProduct.id);

      expect(mockNotificationService.create).toHaveBeenCalledWith(
        'cart.productRemoved',
        'SUCCESS',
        { groupKey: `cart:${mockProduct.id}` },
        expect.objectContaining({ name: mockProduct.name })
      );
    });

    it('emits one create() per change, all sharing the product groupKey (store handles collapsing)', () => {
      const { store } = setup();

      store.addToCart(mockProduct, 1);
      store.addToCart(mockProduct, 2);
      store.addToCart(mockProduct, 3);

      // The cart no longer debounces: every change emits a create() sharing the product's groupKey.
      // Collapsing them into a single toast is the notification store's job (see its own spec).
      expect(mockNotificationService.create).toHaveBeenCalledTimes(3);
      for (const call of mockNotificationService.create.mock.calls) {
        expect(call[2]).toEqual({ groupKey: `cart:${mockProduct.id}` });
      }
    });
  });
});
