import { signal } from '@angular/core';

export const ecoStoreCartStoreMock = {
  method: signal('pickup'),
  totalAmount: signal(100),
  totalAmountWithIva: signal(121),
  totalAmountIva: signal(21),
  amount: signal(0),
  subtotal: signal(100),
  taxes: signal(21),
  total: signal(121),
  totalAmountWithShipping: signal(121),
  address: signal(null),
  day: signal(null),
  time: signal(null),
  updateLogistics: jest.fn(),
  items: signal([]),
  itemsCount: signal(0),
  isEmpty: signal(true),
  addToCart: jest.fn(),
  itemsGroupedByCategory: jest.fn(),
};
