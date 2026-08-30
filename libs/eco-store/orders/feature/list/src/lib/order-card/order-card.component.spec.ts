import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { axe } from 'vitest-axe';
import { OrderCardComponent } from './order-card.component';

describe('OrderCardComponent', () => {
  let component: OrderCardComponent;
  let fixture: ComponentFixture<OrderCardComponent>;

  registerLocaleData(localeCa);

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
    address: {
      id: 'addr-1',
      name: 'Test User',
      address: 'Street 1',
      zip: '12345',
      city: 'City',
      province: undefined,
      country: 'ES',
      phone: undefined,
    },
    deliveryMethod: 'pickup',
    day: null,
    time: null,
    notes: '',
    language: 'ca',
    shipping: 0,
    subtotal: 100,
    tax: 21,
    total: 121,
    created: new Date('2026-03-11T12:00:00Z'),
    updated: new Date('2026-03-11T12:00:00Z'),
    collectionId: 'col1',
    collectionName: 'orders',
  };

  beforeEach(async () => {
    vi.spyOn(TranslateService.prototype, 'getCurrentLang').mockReturnValue('ca');

    await TestBed.configureTestingModule({
      imports: [OrderCardComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
            sanitize: (ctx: any, val: string) => val,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', mockOrder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  it('should display the order number', () => {
    const element = fixture.nativeElement.querySelector('.text-lg.font-bold');

    expect(element.textContent).toContain('#ECO-001');
  });

  it('should display the formatted total', () => {
    const totalElements = fixture.nativeElement.querySelectorAll('.text-lg.font-bold');

    // The second .text-lg.font-bold should contain the total
    expect(totalElements[1].textContent).toContain('121');
  });

  it('should pass highlight input to item names display', () => {
    const mockOrderWithItems: EcoStoreOrder = {
      ...mockOrder,
      items: [{ name: { ca: 'Pizza Margarita' }, quantity: 1, price: 10, total: 10 } as any],
    };

    fixture.componentRef.setInput('order', mockOrderWithItems);
    fixture.componentRef.setInput('highlight', 'mar');
    fixture.detectChanges();

    const itemElements = fixture.nativeElement.querySelectorAll('.text-on-surface-variant span');

    // We expect the item name to contain the highlighted part (wrapped in <mark>)
    // Since we mock the DomSanitizer in pipe tests, here we just check if it contains the text
    expect(itemElements[0].innerHTML).toContain('Pizza <mark');
    expect(itemElements[0].innerHTML).toContain('Mar');
    expect(itemElements[0].innerHTML).toContain('garita');
  });
});
