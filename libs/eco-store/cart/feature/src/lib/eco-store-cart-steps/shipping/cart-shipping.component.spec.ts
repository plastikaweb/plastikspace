import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartShippingComponent } from './cart-shipping.component';
import { provideTranslateService } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreCartStoreMock } from '@plastik/eco-store/cart/data-access/testing';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';
import { provideRouter } from '@angular/router';
import { axe, toHaveNoViolations } from 'jest-axe';
import { signal } from '@angular/core';

describe('CartShippingComponent', () => {
  let component: CartShippingComponent;
  let fixture: ComponentFixture<CartShippingComponent>;

  const mockUserProfileStore = {
    getUserContacts: signal([]),
  };

  const mockTenantService = {
    tenant: signal({
      logisticsConfig: {
        options: [
          {
            type: 'pickup',
            instructions: 'Pickup instructions',
            cost: 0,
            tiers: [],
          },
        ],
      },
    }),
    getTenantAddress: jest.fn().mockReturnValue({}),
    getTenantDeliveryOptionSlotsDays: jest.fn().mockReturnValue([]),
    getTenantDeliveryOptionSlotsTimes: jest.fn().mockReturnValue([]),
    getTenantDeliveryOptionCost: jest.fn().mockReturnValue(0),
    getTenantDeliveryPriceForFreeShipping: jest.fn().mockReturnValue(0),
  };

  beforeEach(async () => {
    expect.extend(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [CartShippingComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: ecoStoreCartStore, useValue: ecoStoreCartStoreMock },
        { provide: pocketBaseUserProfileStore, useValue: mockUserProfileStore },
        { provide: EcoStoreTenantBaseService, useValue: mockTenantService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartShippingComponent);
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
