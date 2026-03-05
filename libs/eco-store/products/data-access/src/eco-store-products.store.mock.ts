import { signal } from '@angular/core';

export const mockEcoStoreProductsStore = {
  entities: signal([
    {
      id: 'prod1',
      normalizedName: 'product-slug',
      name: { ca: 'Producte', es: 'Producto' },
      category: 'cat1',
    },
  ]),
  isLoading: signal(false),
  error: signal(null),
  findProductBySlug: jest.fn().mockImplementation(() => (slug: string) => {
    const product = mockEcoStoreProductsStore.entities().find(p => p.normalizedName === slug);
    if (!product) return undefined;
    return {
      ...product,
      name: (product.name as any)['ca'],
    };
  }),
};
