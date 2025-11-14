export interface BasePocketBaseEntity {
  id: string;
  name: string;
  normalizedName: string;
  created: Date;
  updated: Date;
}

/**
 * @description A base entity that needs a client reference to segment data by client.
 */
export interface BasePocketBaseEntityWithClientRef extends BasePocketBaseEntity {
  clientId: string;
}
