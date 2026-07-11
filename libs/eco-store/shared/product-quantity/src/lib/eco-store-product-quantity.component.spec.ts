import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { axe } from 'vitest-axe';
import { EcoStoreProductQuantityComponent } from './eco-store-product-quantity.component';

describe('EcoStoreProductQuantityComponent', () => {
  let component: EcoStoreProductQuantityComponent;
  let fixture: ComponentFixture<EcoStoreProductQuantityComponent>;

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
      imports: [EcoStoreProductQuantityComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductQuantityComponent);
    fixture.componentRef.setInput('product', mockProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should keep each icon button tooltip consistent with its aria-label', () => {
    fixture.componentRef.setInput('quantity', 5);
    fixture.detectChanges();

    const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip));

    expect(tooltips.length).toBeGreaterThan(0);
    tooltips.forEach(({ nativeElement, injector }) => {
      const tooltip = injector.get(MatTooltip);
      expect(tooltip.message).toBe(nativeElement.getAttribute('aria-label'));
    });
  });

  it('should show the remove tooltip at minimum quantity in card mode', () => {
    fixture.componentRef.setInput('quantity', mockProduct.minQuantity);
    fixture.componentRef.setInput('mode', 'card');
    fixture.detectChanges();

    const decrementTooltip = fixture.debugElement
      .query(By.css('.remove-button'))
      .injector.get(MatTooltip);

    expect(decrementTooltip.message).toBe('products.quantity.remove');
  });
});
