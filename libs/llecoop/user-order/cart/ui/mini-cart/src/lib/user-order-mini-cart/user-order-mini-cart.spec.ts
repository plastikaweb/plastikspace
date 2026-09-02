import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOrderMiniCart } from './user-order-mini-cart';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

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

  it('should set product-specific aria-label and matTooltip for cart items', () => {
    const cartProduct = {
      id: '1',
      name: 'Poma Eco',
      priceWithIva: 2.5,
      quantity: 2,
      unit: { type: 'weight' as const },
    };

    fixture.componentRef.setInput('cart', [cartProduct]);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input[type="number"]');

    expect(inputEl.getAttribute('aria-label')).toBe('Quantitat de Poma Eco');

    const buttonDebugEl = fixture.debugElement.query(By.css('button[matIconButton]'));
    const tooltip = buttonDebugEl.injector.get(MatTooltip);

    expect(buttonDebugEl.nativeElement.getAttribute('aria-label')).toBe('Eliminar Poma Eco del cistell');
    expect(tooltip.message).toBe('Eliminar Poma Eco');
  });

  it('should emit updateQuantity when quantity changes or item is removed', () => {
    const cartProduct = {
      id: '1',
      name: 'Poma Eco',
      priceWithIva: 2.5,
      quantity: 2,
      unit: { type: 'weight' as const },
    };
    const spy = vi.spyOn(component.updateQuantity, 'emit');

    component.onQuantityChange(cartProduct, '5');
    expect(spy).toHaveBeenCalledWith({ ...cartProduct, quantity: 5 });

    component.removeItemFromCart(cartProduct);
    expect(spy).toHaveBeenCalledWith({ ...cartProduct, quantity: 0 });
  });
});
