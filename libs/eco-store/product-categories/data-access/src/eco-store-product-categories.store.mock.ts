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
  isLoading: signal(false),
  error: signal(null),
  findCategoryBySlug: jest.fn().mockImplementation((slug: string) => {
    return mockEcoStoreProductCategoriesStore.entities().find(item => item.normalizedName === slug);
  }),
  getLocalizedCategoryName: jest.fn().mockImplementation(category => {
    return category.name['ca'];
  }),
};
