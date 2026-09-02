import '@angular/compiler';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { TestBed } from '@angular/core/testing';
import { setAllEntities } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
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
  const mockProduct1: EcoStoreProduct = {
    id: 'prod-1',
    name: { ca: 'Poma Organica', es: 'Manzana Organica' },
    description: { ca: 'Poma fresca', es: 'Manzana fresca' },
    normalizedName: 'poma-organica',
    category: 'cat-1',
    priceWithIva: 2.5,
    vat: 10,
    created: new Date(),
    updated: new Date(),
    collectionId: 'col1',
    collectionName: 'products',
  };

  const mockProduct2: EcoStoreProduct = {
    id: 'prod-2',
    name: 'Plàtan',
    description: 'Plàtan de Canàries',
    normalizedName: 'platan',
    category: 'cat-1',
    priceWithIva: 1.8,
    vat: 10,
    created: new Date(),
    updated: new Date(),
    collectionId: 'col1',
    collectionName: 'products',
  };

  const mockCategoryStats: ProductCategoryStats[] = [
    {
      category: 'cat-1',
      totalProducts: 2,
      name: { ca: 'Fruites', es: 'Frutas' },
      normalizedName: 'fruites',
      color: 'red',
      icon: 'apple-icon',
      groupName: { ca: 'Frescos', es: 'Frescos' },
    },
  ];

  const mockCategoriesStore = {
    stats: vi.fn().mockReturnValue(mockCategoryStats),
  };

  const mockApiService = {
    getList: vi.fn().mockReturnValue(of({ items: [], totalItems: 0 })),
    getOneBySlug: vi.fn().mockReturnValue(of(mockProduct1)),
  };

  const mockTranslateService = {
    instant: vi.fn(),
    onLangChange: of({ lang: 'ca' }),
    getCurrentLang: () => 'ca',
    getFallbackLang: () => 'ca',
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        ecoStoreProductsStore,
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { autoCancellation: vi.fn(), send: vi.fn() },
        },
        {
          provide: POCKETBASE_ENVIRONMENT,
          useValue: { production: false, environment: 'test' },
        },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: ecoStoreProductCategoriesStore, useValue: mockCategoriesStore },
        { provide: EcoStoreProductsApiService, useValue: mockApiService },
      ],
    });

    return TestBed.inject(ecoStoreProductsStore);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    const store = setup();

    expect(store).toBeTruthy();
  });

  describe('productsBySlugMap & findProductBySlug', () => {
    it('should return undefined when finding product with null or empty slug', () => {
      const store = setup();

      expect(store.findProductBySlug()(null)).toBeUndefined();
      expect(store.findProductBySlug()('')).toBeUndefined();
    });

    it('should return undefined if slug does not match any product', () => {
      const store = setup();

      updateState(store, '[test] set entities', setAllEntities([mockProduct1]));

      expect(store.findProductBySlug()('non-existent-slug')).toBeUndefined();
    });

    it('should index products in productsBySlugMap and find product by slug with translated fields', () => {
      const store = setup();

      updateState(store, '[test] set entities', setAllEntities([mockProduct1, mockProduct2]));

      const slugMap = store.productsBySlugMap();

      expect(slugMap.size).toBe(2);
      expect(slugMap.has('poma-organica')).toBe(true);
      expect(slugMap.has('platan')).toBe(true);

      const product = store.findProductBySlug()('poma-organica');

      expect(product).toBeDefined();
      expect(product?.name).toBe('Poma Organica');
      expect(product?.categoryName).toBe('Fruites');
      expect(product?.categorySlug).toBe('fruites');
      expect(product?.categoryColor).toBe('red');
      expect(product?.categoryIcon).toBe('apple-icon');
    });
  });
});
