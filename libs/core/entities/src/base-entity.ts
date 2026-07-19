import { Timestamp } from '@angular/fire/firestore';
export type LocalizedFields<T extends string = string> = Record<T, string>;

export type BaseEntity<T extends string = string> = {
  readonly id: string | number;
  name: string | LocalizedFields<T>;
  normalizedName?: string;
  createdAt?: Date | Timestamp | string;
  updatedAt?: Date | Timestamp | string;
} & Record<string, unknown>;

/**
 * Structural base for entities whose backing record has no name field.
 */
export type BaseEntityNameless<T extends string = string> = Omit<
  BaseEntity<T>,
  'name' | 'normalizedName'
>;
