/** `order_cycles.status`, in the order a weekly cycle of a window tenant goes through them. */
export const ORDER_CYCLE_STATUSES = ['DRAFT', 'OPEN', 'PROCESSING', 'COMPLETED', 'CLOSED'] as const;

/** The status of an order cycle. */
export type EcoStoreOrderCycleStatus = (typeof ORDER_CYCLE_STATUSES)[number];
