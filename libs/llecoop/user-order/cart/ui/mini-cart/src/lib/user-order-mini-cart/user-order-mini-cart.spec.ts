import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { axe } from 'vitest-axe';
import { UserOrderMiniCart } from './user-order-mini-cart';

const mockCart: LlecoopProductWithQuantity[] = [
  {
    id: 'prod-1',
    name: 'Poma Ecològica',
    priceWithIva: 2.5,
    quantity: 3,
    unit: { type: 'weight' },
    category: { id: 'cat-1', name: 'Fruita', color: '#ff0000' },
  } as unknown as LlecoopProductWithQuantity,
];

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

  it('should pass accessibility (axe) checks when empty', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  it('should render item-specific ARIA labels and pass axe checks with items', async () => {
    fixture.componentRef.setInput('cart', mockCart);
    fixture.componentRef.setInput('total', 7.5);
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(By.css('button[maticonbutton]'));

    expect(deleteBtn.nativeElement.getAttribute('aria-label')).toBe(
      'Eliminar Poma Ecològica del cistell'
    );

    const qtyInput = fixture.debugElement.query(By.css('input[matinput]'));

    expect(qtyInput.nativeElement.getAttribute('aria-label')).toBe('Quantitat de Poma Ecològica');

    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
