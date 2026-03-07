import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';
import { CartOrderSummaryComponent } from './cart-order-summary.component';

describe('CartOrderSummaryComponent', () => {
  let component: CartOrderSummaryComponent;
  let fixture: ComponentFixture<CartOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideTranslateService()],
      imports: [CartOrderSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('subtotal', 100);
    fixture.componentRef.setInput('taxes', 21);
    fixture.componentRef.setInput('total', 121);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toEqual([]);
  });
});
