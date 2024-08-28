export type BaseEntity = {
  readonly id?: string;
  name?: string;
} & Record<string, unknown>;
