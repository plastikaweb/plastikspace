import { signal } from '@angular/core';

export const MockedUserOrderStore = {
  entities: signal([
    { id: '1', name: 'order A', orderListId: '3' },
    { id: '2', name: 'order B', orderListId: '1' },
    { id: '3', name: 'order C', orderListId: '2' },
  ]),
};
