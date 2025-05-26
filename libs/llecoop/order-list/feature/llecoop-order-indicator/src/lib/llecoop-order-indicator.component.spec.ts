import { DebugElement, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
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
  let viewUserOrderBtn: DebugElement;
  let createUserOrderBtn: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderIndicatorComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        provideMockStore({
          initialState: {},
        }),
        { provide: llecoopUserOrderStore, useValue: MockedUserOrderStore },
        { provide: llecoopOrderListStore, useValue: MockedOrderListStore },
      ],
    }).compileComponents();

    MockedUserOrderStore.currentUserOrder.set(mockedCurrentUserOrder);
    MockedOrderListStore.currentOrderList.set(mockedCurrentOrderList);

    fixture = TestBed.createComponent(LlecoopOrderIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    viewUserOrderBtn = fixture.debugElement.query(By.css('[test-id="view-user-order-btn"]'));
    createUserOrderBtn = fixture.debugElement.query(By.css('[test-id="create-user-order-btn"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user order chip when both currentOrderList and currentUserOrder are available', () => {
    expect(viewUserOrderBtn).toBeTruthy();
    expect(createUserOrderBtn).toBeFalsy();

    const matBadge = viewUserOrderBtn.nativeElement.querySelector('.mat-badge-content');
    expect(matBadge).toBeTruthy();
    expect(matBadge.textContent).toBe('2');
    expect(viewUserOrderBtn.nativeElement.textContent).toContain('#order A');
    expect(viewUserOrderBtn.nativeElement.textContent).toContain('110'); // totalPrice + deliveryPrice
  });

  it('should navigate to correct route when user order chip is clicked', () => {
    const routerLink = viewUserOrderBtn.nativeElement.getAttribute('ng-reflect-router-link');
    expect(routerLink).toContain('./comandes/1');
  });

  it('should display correct badge count for cart items', () => {
    const matBadge = viewUserOrderBtn.nativeElement.querySelector('.mat-badge-content');
    expect(matBadge).toBeTruthy();
    expect(matBadge.textContent).toBe('2');
  });

  it('should calculate and display correct total price when values change', () => {
    const mockedCart = [...(mockedCurrentUserOrder?.cart || []), { id: 'product3' }];
    const newCurrentUserOrder = {
      ...mockedCurrentUserOrder,
      totalPrice: 165,
      cart: mockedCart,
    } as UserOrder;
    MockedUserOrderStore.currentUserOrder.set(newCurrentUserOrder);
    MockedOrderListStore.currentOrderList.set(mockedCurrentOrderList);
    fixture.detectChanges();

    const matBadge = viewUserOrderBtn.nativeElement.querySelector('.mat-badge-content');
    expect(matBadge).toBeTruthy();
    expect(matBadge.textContent).toBe('3');

    const totalPrice = viewUserOrderBtn.nativeElement.textContent.trim();
    expect(totalPrice).toContain(
      (newCurrentUserOrder.totalPrice + newCurrentUserOrder.deliveryPrice).toString()
    );
  });

  it('should display "Fes comanda" chip when only currentOrderList is available', async () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    createUserOrderBtn = fixture.debugElement.query(By.css('[test-id="create-user-order-btn"]'));

    expect(createUserOrderBtn).toBeTruthy();
    expect(createUserOrderBtn.nativeElement.textContent).toContain('Fes comanda');
  });

  it('should navigate to create order route when "Fes comanda" chip is clicked', async () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    createUserOrderBtn = fixture.debugElement.query(By.css('[test-id="create-user-order-btn"]'));

    expect(createUserOrderBtn).toBeTruthy();

    const routerLink = createUserOrderBtn.nativeElement.getAttribute('ng-reflect-router-link');
    expect(routerLink).toContain('./comandes/crear');
  });

  it('should display nothing when neither currentOrderList nor currentUserOrder are available', async () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    MockedOrderListStore.currentOrderList.set(null);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    viewUserOrderBtn = fixture.debugElement.query(By.css('[test-id="view-user-order-btn"]'));
    createUserOrderBtn = fixture.debugElement.query(By.css('[test-id="create-user-order-btn"]'));

    expect(viewUserOrderBtn).toBeFalsy();
    expect(createUserOrderBtn).toBeFalsy();
  });
});
