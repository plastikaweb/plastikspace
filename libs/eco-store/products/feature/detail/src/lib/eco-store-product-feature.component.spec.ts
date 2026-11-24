import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { signal } from '@angular/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { mockEcoStoreCartStore } from '@plastik/eco-store/cart/data-access/testing';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { mockEcoStoreProductsStore } from '@plastik/eco-store/products/data-access/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { axe } from 'vitest-axe';
import EcoStoreProductFeatureComponent from './eco-store-product-feature.component';

describe('EcoStoreProductFeatureComponent', () => {
  let component: EcoStoreProductFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProductFeatureComponent>;

  const mockProductsStore = {
    ...mockEcoStoreProductsStore,
    selectedItemId: signal<string | null>('prod1'),
    productsWithTranslatedText: signal([
      {
        id: 'prod1',
        name: 'Organic Honey',
        images: ['img1.jpg', 'img2.jpg'],
        categoryName: 'Honey',
        categoryIcon: 'honey',
        description: 'Raw honey',
        priceWithIva: 5.5,
        unitType: 'unit',
        unitBase: 1,
        stock: 10,
      },
    ]),
    sort: signal({ active: 'name', direction: 'asc' }),
    pagination: signal({ page: 1, perPage: 10 }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductFeatureComponent],
      providers: [
        provideTranslateService(),
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: ecoStoreCartStore,
          useValue: {
            ...mockEcoStoreCartStore,
            entityMap: signal({}),
          },
        },
        {
          provide: ecoStoreProductsStore,
          useValue: mockProductsStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render thumbnail buttons with aria-label and aria-pressed attributes when product has images', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.media-thumbnails button');

    expect(buttons.length).toBe(2);

    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-label')).toBe('products.selectThumbnail');

    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-label')).toBe('products.selectThumbnail');
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  }, 10000);
});
