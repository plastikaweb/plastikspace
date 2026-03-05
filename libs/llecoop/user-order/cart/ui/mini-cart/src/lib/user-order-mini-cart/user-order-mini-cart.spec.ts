import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOrderMiniCart } from './user-order-mini-cart';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

describe('UserOrderMiniCart', () => {
  let component: UserOrderMiniCart;
  let fixture: ComponentFixture<UserOrderMiniCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOrderMiniCart],
      providers: [provideZonelessChangeDetection(), provideMockStore({ initialState: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrderMiniCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
