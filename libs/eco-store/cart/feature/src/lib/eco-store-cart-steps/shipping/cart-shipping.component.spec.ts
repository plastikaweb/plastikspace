import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartShippingComponent } from './cart-shipping.component';
import { provideTranslateService } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { mockEcoStoreCartStore } from '@plastik/eco-store/cart/data-access/testing';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { provideRouter } from '@angular/router';
import { axe, toHaveNoViolations } from 'jest-axe';
import { signal } from '@angular/core';

describe('CartShippingComponent', () => {
  let component: CartShippingComponent;
  let fixture: ComponentFixture<CartShippingComponent>;

  const mockUserProfileStore = {
    getUserContacts: signal([]),
    loaded: signal(true),
    user: signal({
      id: '1',
      name: 'user',
      email: 'user@example.com',
      role: 'user',
      contacts: [],
    }),
  };

  beforeEach(async () => {
    expect.extend(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [CartShippingComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: ecoStoreCartStore, useValue: mockEcoStoreCartStore },
        { provide: pocketBaseUserProfileStore, useValue: mockUserProfileStore },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
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
