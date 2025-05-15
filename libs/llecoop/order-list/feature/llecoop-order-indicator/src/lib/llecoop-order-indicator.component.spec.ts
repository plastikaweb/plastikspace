import { provideExperimentalZonelessChangeDetection } from '@angular/core';
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
import { selectIsActive } from '@plastik/shared/activity/data-access';

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
        provideMockStore({
          initialState: {},
          selectors: [{ selector: selectIsActive, value: false }],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user order chip when both currentOrderList and currentUserOrder are available', () => {
    fixture.detectChanges();

    const matButton = fixture.debugElement.query(By.css('button[mat-button]'));

    expect(matButton).toBeTruthy();

    const matBadge = matButton.nativeElement.querySelector('.mat-badge-content');
    expect(matBadge).toBeTruthy();
    expect(matBadge.textContent).toBe('2');
    expect(matButton.nativeElement.textContent).toContain('#order A');
    expect(matButton.nativeElement.textContent).toContain('110'); // totalPrice + deliveryPrice
  });

  it('should navigate to correct route when user order chip is clicked', () => {
    fixture.detectChanges();

    const matButton = fixture.debugElement.query(By.css('button[mat-button]'));
    expect(matButton).toBeTruthy();

    const routerLink = matButton.nativeElement.getAttribute('ng-reflect-router-link');
    expect(routerLink).toContain('./comandes/1');
  });

  it('should display "Fes comanda" chip when only currentOrderList is available', () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();

    const matButton = fixture.debugElement.query(By.css('button[mat-button]'));
    expect(matButton).toBeTruthy();
    expect(matButton.nativeElement.textContent).toContain('Fes comanda');
  });

  it('should navigate to create order route when "Fes comanda" chip is clicked', () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    fixture.detectChanges();

    const matButton = fixture.debugElement.query(By.css('button[mat-button]'));
    expect(matButton).toBeTruthy();

    const routerLink = matButton.nativeElement.getAttribute('ng-reflect-router-link');
    expect(routerLink).toContain('./comandes/crear');
  });

  it('should display nothing when neither currentOrderList nor currentUserOrder are available', () => {
    MockedUserOrderStore.currentUserOrder.set(null);
    MockedOrderListStore.currentOrderList.set(null);

    fixture.detectChanges();

    const element = fixture.debugElement.nativeElement;
    expect(element.textContent).toBe('');
  });

  it('should display correct badge count for cart items', () => {
    fixture.detectChanges();

    const matButton = fixture.debugElement.query(By.css('button[mat-button]'));
    expect(matButton).toBeTruthy();

    const matBadge = matButton.nativeElement.querySelector('.mat-badge-content');
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

    const matButton = fixture.debugElement.query(By.css('button[mat-button]'));
    expect(matButton).toBeTruthy();

    const matBadge = matButton.nativeElement.querySelector('.mat-badge-content');
    expect(matBadge).toBeTruthy();
    expect(matBadge.textContent).toBe('3');

    const totalPrice = matButton.nativeElement.textContent.trim();
    expect(totalPrice).toContain(
      (newCurrentUserOrder.totalPrice + newCurrentUserOrder.deliveryPrice).toString()
    );
  });
});
