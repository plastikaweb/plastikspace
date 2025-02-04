import { signal } from '@angular/core';

export const MockedOrderListStore = {
  currentOrder: signal({ id: '1', name: 'order A' }),
};
