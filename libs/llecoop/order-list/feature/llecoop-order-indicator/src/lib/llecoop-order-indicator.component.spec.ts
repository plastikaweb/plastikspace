import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
  mockedCurrentOrderList,
  mockedCurrentUserOrder,
  MockedOrderListStore,
  MockedUserOrderStore,
  UserOrder,
} from '@plastik/llecoop/order-list/data-access';

import { LlecoopOrderIndicatorComponent } from './llecoop-order-indicator.component';

describe('LlecoopOrderIndicatorComponent', () => {
  let component: LlecoopOrderIndicatorComponent;
  let fixture: ComponentFixture<LlecoopOrderIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderIndicatorComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        { provide: llecoopUserOrderStore, useValue: MockedUserOrderStore },
        { provide: llecoopOrderListStore, useValue: MockedOrderListStore },
      ],
    }).compileComponents();

    MockedUserOrderStore.currentUserOrder.set(mockedCurrentUserOrder);
    MockedOrderListStore.currentOrderList.set(mockedCurrentOrderList);

    fixture = TestBed.createComponent(LlecoopOrderIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user order chip when both currentOrderList and currentUserOrder are available', () => {
    fixture.detectChanges();
    const matChip = fixture.debugElement.query(By.css('mat-chip[role="button"]'));
    const matBadge = matChip.nativeElement.querySelector('.mat-badge-content');

    expect(matChip).toBeTruthy();
    expect(matBadge.textContent).toBe('2');
    expect(matChip.nativeElement.textContent).toContain('#order A');
    expect(matChip.nativeElement.textContent).toContain('110'); // totalPrice + deliveryPrice
  });

  it('should navigate to correct route when user order chip is clicked', () => {
    const matChip = fixture.debugElement.query(By.css('mat-chip[role="button"]'));
    const routerLink = matChip.nativeElement.getAttribute('ng-reflect-router-link');

    expect(routerLink).toContain('./soci/comanda/1');
  });

  it('should display "Fes comanda" chip when only currentOrderList is available', () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();

    const matChip = fixture.debugElement.query(By.css('mat-chip[role="button"]'));

    expect(matChip).toBeTruthy();
    expect(matChip.nativeElement.textContent).toContain('Fes comanda');
  });

  it('should navigate to create order route when "Fes comanda" chip is clicked', () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();

    const matChip = fixture.debugElement.query(By.css('mat-chip[role="button"]'));
    const routerLink = matChip.nativeElement.getAttribute('ng-reflect-router-link');

    expect(routerLink).toContain('./soci/comanda/crear');
  });

  it('should display "Cap comanda activa" chip when neither currentOrderList nor currentUserOrder are available', () => {
    MockedOrderListStore.currentOrderList.set(null);
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();

    // Usar un selector más general
    const matChip = fixture.debugElement.query(By.css('mat-chip'));

    expect(matChip).toBeTruthy();
    expect(matChip.nativeElement.textContent).toContain('Cap comanda activa');
  });

  it('should display correct badge count for cart items', () => {
    const matChip = fixture.debugElement.query(By.css('mat-chip[role="button"]'));
    const matBadge = matChip.nativeElement.querySelector('.mat-badge-content');

    expect(matBadge.textContent).toBe('2');
  });

  it('should calculate and display correct total price when values change', () => {
    const orderData = mockedCurrentUserOrder as UserOrder;

    MockedUserOrderStore.currentUserOrder.set({
      ...orderData,
      cart: [{ id: 'product1' }, { id: 'product2' }, { id: 'product3' }],
      totalPrice: 150,
      deliveryPrice: 15,
    });
    MockedOrderListStore.currentOrderList.set(mockedCurrentOrderList);
    fixture.detectChanges();

    const matChip = fixture.debugElement.query(By.css('mat-chip[role="button"]'));
    const matBadge = matChip.nativeElement.querySelector('.mat-badge-content');
    const totalPrice = matChip.nativeElement.textContent.trim();

    expect(matBadge.textContent).toBe('3');
    expect(totalPrice).toContain('165');
  });
});
