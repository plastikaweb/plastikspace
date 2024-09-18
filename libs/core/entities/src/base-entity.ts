import { EntityId } from '@ngrx/signals/entities';

export type BaseEntity = {
  readonly id?: EntityId;
  name?: string;
} & Record<string, unknown>;
