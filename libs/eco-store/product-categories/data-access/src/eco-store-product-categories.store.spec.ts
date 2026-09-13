import { updateState } from '@angular-architects/ngrx-toolkit';
import { TestBed } from '@angular/core/testing';
import { setAllEntities } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ProductCategoryStats } from '@plastik/eco-store/entities';
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ecoStoreProductCategoriesStore } from './eco-store-product-categories.store';

describe('ecoStoreProductCategoriesStore', () => {
  let store: InstanceType<typeof ecoStoreProductCategoriesStore>;

  const mockCategoryStats: ProductCategoryStats[] = [
    {
      category: 'cat1',
      groupName: { ca: 'Grup 1', es: 'Grupo 1', en: 'Group 1' },
      name: { ca: 'Fruit', es: 'Fruta', en: 'Fruit' },
      normalizedName: 'fruit',
      totalProducts: 5,
      icon: 'apple',
      color: 'red',
      tenant: 'tenant1',
    },
    {
      category: 'cat2',
      groupName: { ca: 'Grup 1', es: 'Grupo 1', en: 'Group 1' },
      name: { ca: 'Verdures', es: 'Verduras', en: 'Vegetables' },
      normalizedName: 'vegetables',
      totalProducts: 3,
      icon: 'carrot',
      color: 'green',
      tenant: 'tenant1',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: TranslateService,
          useValue: {
            onLangChange: of({ lang: 'ca' }),
            getCurrentLang: () => 'ca',
            getFallbackLang: () => 'ca',
            instant: vi.fn(key => key),
          },
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: ALL_PRODUCTS_ICON,
          useValue: 'category',
        },
        ecoStoreProductCategoriesStore,
      ],
    });

    store = TestBed.inject(ecoStoreProductCategoriesStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('categoriesBySlugMap', () => {
    it('should index category stats by normalizedName (slug) in O(1) Map', () => {
      updateState(
        store,
        'set categories',
        setAllEntities(mockCategoryStats, {
          selectId: (entity: ProductCategoryStats) => entity.category,
        })
      );

      const map = store.categoriesBySlugMap();
      expect(map.size).toBe(2);
      expect(map.get('fruit')).toEqual(mockCategoryStats[0]);
      expect(map.get('vegetables')).toEqual(mockCategoryStats[1]);
      expect(map.get('non-existent')).toBeUndefined();
    });
  });

  describe('findCategoryBySlug', () => {
    beforeEach(() => {
      updateState(
        store,
        'set categories',
        setAllEntities(mockCategoryStats, {
          selectId: (entity: ProductCategoryStats) => entity.category,
        })
      );
    });

    it('should return category stat when valid slug matches', () => {
      const result = store.findCategoryBySlug('fruit');
      expect(result).toEqual(mockCategoryStats[0]);
    });

    it('should return undefined when slug is null or empty', () => {
      expect(store.findCategoryBySlug(null)).toBeUndefined();
      expect(store.findCategoryBySlug('')).toBeUndefined();
    });

    it('should return undefined when slug does not exist', () => {
      expect(store.findCategoryBySlug('non-existent')).toBeUndefined();
    });
  });

  describe('computed totalProducts and groupedCategories', () => {
    it('should compute totalProducts correctly', () => {
      updateState(
        store,
        'set categories',
        setAllEntities(mockCategoryStats, {
          selectId: (entity: ProductCategoryStats) => entity.category,
        })
      );

      expect(store.totalProducts()).toBe(8);
    });

    it('should group categories correctly by groupName', () => {
      updateState(
        store,
        'set categories',
        setAllEntities(mockCategoryStats, {
          selectId: (entity: ProductCategoryStats) => entity.category,
        })
      );

      const groups = store.groupedCategories();
      expect(groups.length).toBe(1);
      expect(groups[0].categories.length).toBe(2);
    });
  });
});
