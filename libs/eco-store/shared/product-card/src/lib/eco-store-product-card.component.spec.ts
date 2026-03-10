import { IMAGE_LOADER } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProductCardComponent } from './eco-store-product-card.component';

describe('EcoStoreProductCardComponent', () => {
  let component: EcoStoreProductCardComponent;
  let fixture: ComponentFixture<EcoStoreProductCardComponent>;

  const mockProduct: EcoStoreProductWithCategoryName = {
    tenant: 'tenant-1',
    id: '1',
    name: 'Test Product',
    normalizedName: 'test-product',
    inStock: true,
    stock: 10,
    price: 10,
    iva: 0.21,
    priceWithIva: 12.1,
    unitType: 'unit',
    unitBase: null,
    category: 'category-1',
    minQuantity: 1,
    maxQuantity: 10,
    description: 'Test Description',
    images: ['image1.jpg'],
    collectionId: 'collection-1',
    collectionName: 'products',
    created: new Date('2023-01-01'),
    updated: new Date('2023-01-01'),
    categoryName: 'Test Category',
    categoryColor: '#000000',
    categorySlug: 'test-category',
    features: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductCardComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: IMAGE_LOADER,
          useFactory: () => (src: string) => `https://test.io/${src}`,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.componentRef.setInput('isFirst', false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    await fixture.whenStable();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
