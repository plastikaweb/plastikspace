import '@angular/compiler';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { setAllEntities } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreProductsApiService } from './eco-store-products-api.service';
import { ecoStoreProductsStore } from './eco-store-products.store';

describe('ecoStoreProductsStore', () => {
  let store: InstanceType<typeof ecoStoreProductsStore>;
  let onLangChangeEmitter: EventEmitter<{ lang: string }>;

  const mockCategoriesStore = {
    stats: vi.fn().mockReturnValue([
      {
        category: 'cat1',
        name: { ca: 'Categoria 1', es: 'Categoría 1' },
        normalizedName: 'categoria-1',
        color: '#ff0000',
        icon: 'fruit',
      },
    ]),
  };

  const mockProduct1: EcoStoreProduct = {
    id: 'p1',
    normalizedName: 'poma-ecologica',
    name: { ca: 'Poma ecològica', es: 'Manzana ecológica' } as any,
    description: { ca: 'Poma fresca', es: 'Manzana fresca' } as any,
    features: [{ ca: 'Local', es: 'Local' }] as any,
    price: 2,
    priceWithIva: 2.2,
    iva: 10,
    unitBase: 1,
    tenant: 'tenant1',
    maxQuantity: 10,
    minQuantity: 1,
    category: 'cat1',
    stock: 50,
    unitType: 'weight',
    images: ['apple.png'],
    created: new Date(),
    updated: new Date(),
    collectionId: 'col1',
    collectionName: 'col1',
    inStock: true,
  };

  const mockProduct2: EcoStoreProduct = {
    id: 'p2',
    normalizedName: 'pera-ecologica',
    name: 'Pera ecològica' as any,
    description: 'Pera fresca' as any,
    features: ['Ecològica'] as any,
    price: 3,
    priceWithIva: 3.3,
    iva: 10,
    unitBase: 1,
    tenant: 'tenant1',
    maxQuantity: 10,
    minQuantity: 1,
    category: 'cat1',
    stock: 20,
    unitType: 'weight',
    images: ['pear.png'],
    created: new Date(),
    updated: new Date(),
    collectionId: 'col1',
    collectionName: 'col1',
    inStock: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    onLangChangeEmitter = new EventEmitter<{ lang: string }>();

    const mockTranslateService = {
      onLangChange: onLangChangeEmitter,
      getCurrentLang: vi.fn().mockReturnValue('ca'),
      getFallbackLang: vi.fn().mockReturnValue('ca'),
    };

    const mockApiService = {
      getOneBySlug: vi.fn().mockReturnValue(of(mockProduct1)),
      getList: vi.fn().mockReturnValue(of({ items: [], totalItems: 0 })),
      getFullList: vi.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        ecoStoreProductsStore,
        { provide: POCKETBASE_INSTANCE, useValue: mockPocketBase },
        { provide: POCKETBASE_ENVIRONMENT, useValue: { production: false, environment: 'test' } },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ecoStoreProductCategoriesStore, useValue: mockCategoriesStore },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: EcoStoreProductsApiService, useValue: mockApiService },
      ],
    });

    store = TestBed.inject(ecoStoreProductsStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should translate products using current language in productsWithTranslatedText', () => {
    updateState(
      store,
      '[test] set entities',
      setAllEntities([mockProduct1, mockProduct2], { selectId: p => p.id })
    );

    const translated = store.productsWithTranslatedText();
    expect(translated.length).toBe(2);

    expect(translated[0].name).toBe('Poma ecològica');
    expect(translated[0].description).toBe('Poma fresca');
    expect(translated[0].categoryName).toBe('Categoria 1');
    expect(translated[0].categorySlug).toBe('categoria-1');

    expect(translated[1].name).toBe('Pera ecològica');
    expect(translated[1].description).toBe('Pera fresca');
  });

  it('should build productsBySlugMap for O(1) slug lookup', () => {
    updateState(
      store,
      '[test] set entities',
      setAllEntities([mockProduct1, mockProduct2], { selectId: p => p.id })
    );

    const slugMap = store.productsBySlugMap();
    expect(slugMap.size).toBe(2);
    expect(slugMap.has('poma-ecologica')).toBe(true);
    expect(slugMap.get('poma-ecologica')?.name).toBe('Poma ecològica');
  });

  it('should find product by slug using findProductBySlug', () => {
    updateState(
      store,
      '[test] set entities',
      setAllEntities([mockProduct1, mockProduct2], { selectId: p => p.id })
    );

    const lookup = store.findProductBySlug();

    expect(lookup(null)).toBeUndefined();
    expect(lookup('non-existent')).toBeUndefined();

    const product = lookup('poma-ecologica');
    expect(product).toBeDefined();
    expect(product?.id).toBe('p1');
    expect(product?.name).toBe('Poma ecològica');
    expect(product?.categoryName).toBe('Categoria 1');
    expect(product?.categorySlug).toBe('categoria-1');
  });

  it('should set selected product id from slug using setSelectedFromSlug', () => {
    updateState(
      store,
      '[test] set entities',
      setAllEntities([mockProduct1, mockProduct2], { selectId: p => p.id })
    );

    const success = store.setSelectedFromSlug('pera-ecologica');
    expect(success).toBe(true);
    expect(store.selectedItemId()).toBe('p2');

    const notFound = store.setSelectedFromSlug('unknown');
    expect(notFound).toBe(false);
  });
});
