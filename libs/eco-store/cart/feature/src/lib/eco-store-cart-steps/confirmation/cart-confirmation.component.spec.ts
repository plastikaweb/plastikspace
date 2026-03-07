import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { mockEcoStoreCartStore } from '@plastik/eco-store/cart/data-access/testing';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { axe } from 'vitest-axe';
import { CartConfirmationComponent } from './cart-confirmation.component';

describe('CartConfirmationComponent', () => {
  let component: CartConfirmationComponent;
  let fixture: ComponentFixture<CartConfirmationComponent>;
  let cartStoreMock: any;
  let ordersStoreMock: any;

  beforeEach(async () => {
    cartStoreMock = {
      ...mockEcoStoreCartStore,
      notes: signal('initial notes'),
      method: signal('delivery'),
      day: signal('monday'),
      time: signal('10:00 - 12:00'),
      address: signal({ address: 'Street 1', zip: '12345', city: 'City' }),
      subtotal: signal(100),
      tax: signal(21),
      shipping: signal(5),
      total: signal(126),
      items: signal([]),
      itemsGroupedByCategory: signal({} as any),
      updateLogistics: vi.fn(),
    };

    ordersStoreMock = {
      createOrder: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartConfirmationComponent],
      providers: [
        provideRouter([]),
        provideEnvironmentPocketBaseTranslationMock(),
        provideTranslateService(),
        { provide: ecoStoreCartStore, useValue: cartStoreMock },
        { provide: ecoStoreOrdersStore, useValue: ordersStoreMock },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should update cart store when notes change', () => {
    component.onChange({ notes: 'new notes' });
    expect(cartStoreMock.updateLogistics).toHaveBeenCalledWith({ notes: 'new notes' });
  });

  it('should render the order summary', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('eco-cart-order-summary')).toBeTruthy();
  });

  it('should render product cards for cart items', () => {
    cartStoreMock.items.set([
      {
        product: { id: '1', name: 'P1', price: 10, priceWithIva: 12.1, iva: 21 },
        quantity: 1,
      },
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('eco-cart-product-card')).toBeTruthy();
  });
});
