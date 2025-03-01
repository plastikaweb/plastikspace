import { signal } from '@angular/core';

export type UserOrder = {
  id: string;
  name: string;
  orderListId: string;
  cart: { id: string }[];
  totalPrice: number;
  deliveryPrice: number;
};

export const mockedCurrentUserOrder = {
  id: '1',
  name: 'order A',
  orderListId: '3',
  cart: [{ id: 'product1' }, { id: 'product2' }],
  totalPrice: 100,
  deliveryPrice: 10,
} as UserOrder | null;

export const MockedUserOrderStore = {
  entities: signal([
    { id: '1', name: 'order A', orderListId: '3' },
    { id: '2', name: 'order B', orderListId: '1' },
    { id: '3', name: 'order C', orderListId: '2' },
  ]),
  currentUserOrder: signal(mockedCurrentUserOrder),
};
