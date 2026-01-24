import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreCartStoreMock } from '@plastik/eco-store/cart/data-access/testing';
import { toHaveNoViolations } from 'jest-axe';
import { CartConfirmationComponent } from './cart-confirmation.component';
import { axe } from 'jest-axe';

describe('CartConfirmationComponent', () => {
  let component: CartConfirmationComponent;
  let fixture: ComponentFixture<CartConfirmationComponent>;

  beforeEach(async () => {
    expect.extend(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [CartConfirmationComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: ecoStoreCartStore, useValue: ecoStoreCartStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartConfirmationComponent);
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
