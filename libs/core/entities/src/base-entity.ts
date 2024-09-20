import { Timestamp } from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';

export type BaseEntity = {
  readonly id?: EntityId;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} & Record<string, unknown>;
