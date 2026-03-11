import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { of } from 'rxjs';
import { EcoStoreOrdersApiService } from './eco-store-orders-api.service';
import { ecoStoreOrdersStore } from './eco-store-orders.store';

describe('ecoStoreOrdersStore', () => {
  const mockAddress = {
    id: 'addr-1',
    name: 'Test User',
    address: 'Street 1',
    zip: '12345',
    city: 'City',
    province: undefined,
    country: 'ES',
    phone: undefined,
  };

  const mockOrder: EcoStoreOrder = {
    id: 'order-1',
    name: 'ECO-001',
    normalizedName: 'eco-001',
    orderNumber: 'ECO-001',
    user: 'user-1',
    items: [],
    tenant: 'tenant-1',
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    address: mockAddress,
    deliveryMethod: 'pickup',
    day: null,
    time: null,
    notes: '',
    language: 'ca',
    shipping: 0,
    subtotal: 100,
    tax: 21,
    total: 121,
    created: new Date(),
    updated: new Date(),
    collectionId: 'col1',
    collectionName: 'orders',
  };

  const mockCartStoreValue = {
    toOrder: vi.fn().mockReturnValue({
      orderNumber: 'ECO-001',
      user: 'user-1',
      items: [],
    }),
    resetCartAfterCheckout: vi.fn(),
    isSyncing: signal(false),
    isSynced: signal(false),
  };

  const mockActivityStoreValue = {
    setActivity: vi.fn(),
    isActive: signal(false),
    message: signal('loading-data'),
  };

  const mockNotificationStore = {
    show: vi.fn(),
  };

  const mockOrdersApiService = {
    getList: vi.fn().mockReturnValue(
      of({
        items: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        perPage: 10,
      })
    ),
    create: vi.fn().mockReturnValue(of(mockOrder)),
    update: vi.fn().mockReturnValue(of(mockOrder)),
    delete: vi.fn().mockReturnValue(of(true)),
    getOne: vi.fn().mockReturnValue(of(mockOrder)),
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        ecoStoreOrdersStore,
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { autoCancellation: vi.fn(), send: vi.fn() },
        },
        { provide: ecoStoreCartStore, useValue: mockCartStoreValue },
        { provide: activityStore, useValue: mockActivityStoreValue },
        { provide: EcoStoreOrdersApiService, useValue: mockOrdersApiService },
        { provide: notificationStore, useValue: mockNotificationStore },
      ],
    });
    return TestBed.inject(ecoStoreOrdersStore);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    const store = setup();
    expect(store).toBeTruthy();
  });

  it('should have initial isLoading state as false', () => {
    const store = setup();
    expect(store.isLoading()).toBe(false);
  });

  describe('createOrder()', () => {
    let store: ReturnType<typeof setup>;
    let router: Router;

    beforeEach(() => {
      store = setup();
      router = TestBed.inject(Router);
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('should set activity loading state to true before creating an order', async () => {
      await store.createOrder();
      expect(mockActivityStoreValue.setActivity).toHaveBeenCalledWith(
        true,
        'cart.finish.creatingOrder'
      );
    });

    it('should set activity loading state to false after the order is created', async () => {
      await store.createOrder();
      expect(mockActivityStoreValue.setActivity).toHaveBeenLastCalledWith(false);
    });

    it('should call toOrder() on cartStore to convert cart to an order payload', async () => {
      await store.createOrder();
      expect(mockCartStoreValue.toOrder).toHaveBeenCalled();
    });

    it('should create the order via the API service', async () => {
      await store.createOrder();
      expect(mockOrdersApiService.create).toHaveBeenCalled();
    });

    it('should reset the cart after a successful order creation', async () => {
      await store.createOrder();
      expect(mockCartStoreValue.resetCartAfterCheckout).toHaveBeenCalled();
    });

    it('should navigate to the order confirmation page with the new order ID', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      await store.createOrder();
      expect(navigateSpy).toHaveBeenCalledWith(['/comandes', 'nova', mockOrder.id]);
    });
  });
});
