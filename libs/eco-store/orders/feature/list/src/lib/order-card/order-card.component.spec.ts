import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { OrderCardComponent } from './order-card.component';
import { axe } from 'vitest-axe';
import { provideRouter } from '@angular/router';

describe('OrderCardComponent', () => {
  let component: OrderCardComponent;
  let fixture: ComponentFixture<OrderCardComponent>;

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
    await TestBed.configureTestingModule({
      imports: [OrderCardComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
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
});
