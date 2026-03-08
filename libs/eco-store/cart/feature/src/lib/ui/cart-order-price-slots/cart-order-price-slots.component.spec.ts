import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';
import { CartOrderPriceSlotsComponent } from './cart-order-price-slots.component';

describe('CartOrderPriceSlotsComponent', () => {
  let component: CartOrderPriceSlotsComponent;
  let fixture: ComponentFixture<CartOrderPriceSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService()],
      imports: [CartOrderPriceSlotsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartOrderPriceSlotsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tiers', []);
    fixture.componentRef.setInput('cartTotal', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
