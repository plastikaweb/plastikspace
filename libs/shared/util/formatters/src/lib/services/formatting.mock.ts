import { Timestamp } from '@angular/fire/firestore';
import { BaseEntity } from '@plastik/core/entities';

export const objectMocked: TypeMocked = {
  id: 'kkk0000ads',
  name: 'TITLE',
  normalizedName: 'TITLE',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  noFormatting: {
    child: {
      value: 12,
    },
  },
  text: {
    child: {
      value: 'value',
    },
  },
  link: 'www.example.com',
  time: '2021-09-01T02:10:06+00:00',
  image: 'thumb.png',
  percentage: 80,
  truthy: true,
  falsy: false,
  price: 3.08,
  custom: `---`,
} as const;

// Definir TypeMocked para que sea compatible con las restricciones de DataFormatFactoryService
export interface TypeMocked extends BaseEntity {
  [key: string]: unknown;
}
