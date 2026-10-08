import '@angular/compiler';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { setAllEntities } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreProduct, ProductCategoryStats } from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreProductsApiService } from './eco-store-products-api.service';
import { ecoStoreProductsStore } from './eco-store-products.store';

describe('ecoStoreProductsStore', () => {
  let store: InstanceType<typeof ecoStoreProductsStore>;
  let categoriesStore: InstanceType<typeof ecoStoreProductCategoriesStore>;
  const onLangChangeEmitter = new EventEmitter<{ lang: string }>();

  const mockTranslateService = {
    onLangChange: onLangChangeEmitter,
    getCurrentLang: vi.fn().mockReturnValue('ca'),
    getFallbackLang: vi.fn().mockReturnValue('ca'),
    instant: vi.fn(key => key),
  };

  const mockProductsService = {
    getFullList: vi.fn().mockReturnValue(of([])),
    getOneBySlug: vi.fn().mockReturnValue(of(null)),
  };

  const mockProductCategoryStats: ProductCategoryStats[] = [
    {
      id: 'cat-1-stat',
      category: 'cat1',
      name: { ca: 'Fruita', es: 'Fruta', en: 'Fruit' },
      normalizedName: 'fruita',
      color: '#ff0000',
      icon: 'apple',
      totalProducts: 5,
      activeProducts: 5,
      groupName: { ca: 'Alimentació', es: 'Alimentación', en: 'Food' },
    },
  ];

  const mockProducts: EcoStoreProduct[] = [
    {
      id: 'prod-1',
      normalizedName: 'poma-ecologica',
      name: { ca: 'Poma Ecològica', es: 'Manzana Ecológica', en: 'Organic Apple' },
      description: { ca: 'Descripció poma', es: 'Descripción manzana', en: 'Apple description' },
      features: [{ ca: 'Local', es: 'Local', en: 'Local' }],
      category: 'cat1',
      price: 2,
      priceWithIva: 2.2,
      iva: 10,
      unitBase: 1,
      tenant: 'tenant-1',
      maxQuantity: 10,
      minQuantity: 1,
      stock: 100,
      unitType: 'kg',
      images: ['apple.png'],
      created: new Date(),
      updated: new Date(),
      collectionId: 'col-1',
      collectionName: 'products',
      inStock: true,
    },
    {
      id: 'prod-2',
      normalizedName: 'platan-bio',
      name: 'Plàtan Bio',
      description: 'Plàtan fresc',
      category: 'cat1',
      price: 1.5,
      priceWithIva: 1.65,
      iva: 10,
      unitBase: 1,
      tenant: 'tenant-1',
      maxQuantity: 10,
      minQuantity: 1,
      stock: 50,
      unitType: 'kg',
      images: ['banana.png'],
      created: new Date(),
      updated: new Date(),
      collectionId: 'col-1',
      collectionName: 'products',
      inStock: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        ecoStoreProductsStore,
        ecoStoreProductCategoriesStore,
        { provide: POCKETBASE_INSTANCE, useValue: mockPocketBase },
        { provide: EcoStoreProductsApiService, useValue: mockProductsService },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        {
          provide: POCKETBASE_ENVIRONMENT,
          useValue: { production: false, environment: 'test' },
        },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    });

    store = TestBed.inject(ecoStoreProductsStore);
    categoriesStore = TestBed.inject(ecoStoreProductCategoriesStore);

    // Populate stores with mock entities for unit testing computed properties
    updateState(categoriesStore, '[test] populate categories', setAllEntities(mockProductCategoryStats));
    updateState(store, '[test] populate products', setAllEntities(mockProducts));
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should compute productsWithTranslatedText with translated names and categories', () => {
    const translatedProducts = store.productsWithTranslatedText();

    expect(translatedProducts.length).toBe(2);

    const first = translatedProducts[0];

    expect(first.id).toBe('prod-1');
    expect(first.name).toBe('Poma Ecològica');
    expect(first.description).toBe('Descripció poma');
    expect(first.features).toEqual(['Local']);
    expect(first.categoryName).toBe('Fruita');
    expect(first.categorySlug).toBe('fruita');
    expect(first.categoryColor).toBe('#ff0000');
    expect(first.categoryIcon).toBe('apple');

    const second = translatedProducts[1];

    expect(second.id).toBe('prod-2');
    expect(second.name).toBe('Plàtan Bio');
    expect(second.description).toBe('Plàtan fresc');
  });

  it('should find product by slug in O(1) time using findProductBySlug', () => {
    const finder = store.findProductBySlug();
    const product = finder('poma-ecologica');

    expect(product).toBeDefined();
    expect(product?.id).toBe('prod-1');
    expect(product?.name).toBe('Poma Ecològica');
    expect(product?.categoryName).toBe('Fruita');
    expect(product?.categorySlug).toBe('fruita');
  });

  it('should return undefined for non-existent or null slug in findProductBySlug', () => {
    const finder = store.findProductBySlug();

    expect(finder('non-existent')).toBeUndefined();
    expect(finder(null)).toBeUndefined();
  });

  it('should setSelectedFromSlug correctly', () => {
    const found = store.setSelectedFromSlug('platan-bio');

    expect(found).toBe(true);
    expect(store.selectedItemId()).toBe('prod-2');

    const notFound = store.setSelectedFromSlug('unknown-slug');

    expect(notFound).toBe(false);
  });
});
