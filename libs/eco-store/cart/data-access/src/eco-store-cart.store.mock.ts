import { signal } from '@angular/core';
import { EcoStoreCartItem } from '@plastik/eco-store/entities';

export const mockEcoStoreCartStore = {
  entities: signal([] as EcoStoreCartItem[]),
  itemsCount: signal(0),
  subtotal: signal(100),
  tax: signal(21),
  total: signal(121),
  isEmpty: signal(true),
  itemsDictionary: signal({} as Record<string, EcoStoreCartItem>),
  items: signal([] as EcoStoreCartItem[]),
  itemsGroupedByCategory: signal([] as { category: string; items: EcoStoreCartItem[] }[]),
  shipping: signal(0),
  address: signal(null),
  day: signal(null),
  time: signal(null),
  method: signal(null),
  status: signal('ACTIVE' as const),
  expiresAt: signal(null),
  orderCycle: signal(null),
  notes: signal(null),
  remoteCartId: signal(null),
  isSyncing: signal(false),
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn(),
  updateLogistics: vi.fn(),
};
