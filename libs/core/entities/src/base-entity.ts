import { Timestamp } from '@angular/fire/firestore';
export type LocalizedFields<T extends string = string> = Record<T, string>;

/**
 * Structural base for entities whose backing record has no name field.
 *
 * Defined structurally (not via `Omit<BaseEntity<T>, 'name' | 'normalizedName'>`)
 * because `BaseEntity` ends in `& Record<string, unknown>`, which widens
 * `keyof BaseEntity` to `string`. `Omit` on a type whose `keyof` is `string`
 * collapses to a bare index signature (`{ [x: string]: unknown }`), so it
 * would accept any object — including `{}` — and silently drop the `id`
 * guarantee. Declaring the fields directly here keeps that guarantee intact.
 */
export type BaseEntityNameless = {
  readonly id: string | number;
  createdAt?: Date | Timestamp | string;
  updatedAt?: Date | Timestamp | string;
} & Record<string, unknown>;

export type BaseEntity<T extends string = string> = BaseEntityNameless & {
  name: string | LocalizedFields<T>;
  normalizedName?: string;
};
