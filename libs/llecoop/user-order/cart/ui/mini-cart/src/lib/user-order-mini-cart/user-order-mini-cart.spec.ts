import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOrderMiniCart } from './user-order-mini-cart';
import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';

describe('UserOrderMiniCart', () => {
  let component: UserOrderMiniCart;
  let fixture: ComponentFixture<UserOrderMiniCart>;
  let componentRef: ComponentRef<UserOrderMiniCart>;

  const mockCartItem: LlecoopProductWithQuantity = {
    id: '1',
    name: 'Pomes ecològiques',
    priceWithIva: 2.5,
    quantity: 2,
    unit: { type: 'weight' },
    category: 'FRUITA',
    imgUrl: 'http://example.com/poma.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOrderMiniCart],
      providers: [provideZonelessChangeDetection(), provideMockStore({ initialState: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrderMiniCart);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mirror each remove item icon button aria-label with a matching matTooltip', () => {
    componentRef.setInput('cart', [mockCartItem]);
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(By.css('button[matIconButton]'));
    expect(deleteBtn).toBeTruthy();

    const ariaLabel = deleteBtn.nativeElement.getAttribute('aria-label');
    const tooltipMessage = deleteBtn.injector.get(MatTooltip).message;

    expect(ariaLabel).toBe('Eliminar producte: Pomes ecològiques');
    expect(tooltipMessage).toBe(ariaLabel);
  });
});
