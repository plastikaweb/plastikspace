import { signal } from '@angular/core';

type OrderList = {
  id: string;
  name: string;
};

export const mockedCurrentOrderList = { id: '1', name: 'order A' } as OrderList | null;

export const MockedOrderListStore = {
  currentOrderList: signal(mockedCurrentOrderList),
  orderLists: signal([
    { id: '1', name: 'order A' },
    { id: '2', name: 'order B' },
    { id: '3', name: 'order C' },
  ]),
};
