import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { OrderConfirmationComponent } from './order-confirmation.component';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: {
            user: () => ({ email: 'test@example.com' }),
          },
        },
        {
          provide: ecoStoreOrdersStore,
          useValue: {
            getItemById: () => ({ orderNumber: 'ECO-123' }),
            isLoading: () => false,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationComponent);
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
