import { signal } from '@angular/core';

export const mockEcoStoreProductCategoriesStore = {
  entities: signal([
    {
      category: 'cat1',
      normalizedName: 'envasats',
      name: { ca: 'Envasats', es: 'Envasados' },
      totalProducts: 10,
    },
  ]),
  stats: signal([
    {
      category: 'cat1',
      normalizedName: 'envasats',
      name: { ca: 'Envasats', es: 'Envasados' },
      totalProducts: 10,
    },
  ]),
  currentLang: signal('ca'),
  totalProducts: signal(10),
  isLoading: signal(false),
  error: signal(null),
  findCategoryBySlug: vi.fn().mockImplementation((slug: string) => {
    return mockEcoStoreProductCategoriesStore.entities().find(item => item.normalizedName === slug);
  }),
  getCategoryBySlug: vi.fn().mockImplementation((slug: string) => {
    const category = mockEcoStoreProductCategoriesStore
      .entities()
      .find(item => item.normalizedName === slug);
    return category ? { ...category, name: category.name['ca'] } : null;
  }),
  getLocalizedCategoryName: vi.fn().mockImplementation(category => {
    return category.name['ca'];
  }),
};
