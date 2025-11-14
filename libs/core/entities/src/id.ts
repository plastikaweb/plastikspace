export type IdType<T> = T extends { id: infer U } ? U : never;
