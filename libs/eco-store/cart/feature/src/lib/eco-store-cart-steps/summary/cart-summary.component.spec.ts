import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummaryComponent } from './cart-summary.component';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreCartStoreMock } from '@plastik/eco-store/cart/data-access/testing';
import { provideRouter } from '@angular/router';
import { axe, toHaveNoViolations } from 'jest-axe';
import { signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  beforeEach(async () => {
    expect.extend(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: ecoStoreCartStore, useValue: ecoStoreCartStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
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
