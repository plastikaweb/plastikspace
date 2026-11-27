import { PocketBaseMembershipStatus } from '@plastik/core/entities';
import { EcoStoreOrderCycleStatus, ORDER_CYCLE_STATUSES } from './order-cycle';
import { EcoStorePaymentStatus } from './order';
import { ecoStatusChipMaps } from './status-chip';

/*
 * The status chips of the eco platform's state machines, one name per state in both apps
 * (design round 25). Icons, colour families and Catalan labels follow the frozen `Eco Admin DS`
 * §06 (round 40.18) and DESIGN-BRIEF §3.4. The order family lives in `order.ts` since AREF-01.
 */

/**
 * The cycle chips. DESIGN-BRIEF §3.4 draws `CLOSED` as an inverse pair («neutral-dark»), which the
 * shared chip has no variant for: it is `neutral` until the Cicles module needs it.
 */
export const ORDER_CYCLE_STATUS_CHIPS = ecoStatusChipMaps<EcoStoreOrderCycleStatus>(
  ORDER_CYCLE_STATUSES,
  {
    DRAFT: { type: 'neutral', icon: 'draft' },
    OPEN: { type: 'success', icon: 'storefront' },
    PROCESSING: { type: 'info', icon: 'autorenew' },
    COMPLETED: { type: 'primary', icon: 'task_alt' },
    CLOSED: { type: 'neutral', icon: 'lock' },
  },
  'cycles.status'
);

/** `orders.paymentStatus`. */
export const PAYMENT_STATUSES = [
  'UNPAID',
  'PAID',
  'REFUNDED',
  'FAILED',
] as const satisfies readonly EcoStorePaymentStatus[];

/**
 * The payment chips. Every state carries the € glyph, so a payment chip never reads as a second
 * order-status chip on the same row; the DS also draws it outlined, which is the renderer's job.
 */
export const PAYMENT_STATUS_CHIPS = ecoStatusChipMaps<EcoStorePaymentStatus>(
  PAYMENT_STATUSES,
  {
    UNPAID: { type: 'warning', icon: 'euro' },
    PAID: { type: 'success', icon: 'euro' },
    REFUNDED: { type: 'info', icon: 'euro' },
    FAILED: { type: 'error', icon: 'euro' },
  },
  'payments.status'
);

/** `users.membershipStatus`. */
export const MEMBERSHIP_STATUSES = [
  'TRIAL',
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
] as const satisfies readonly PocketBaseMembershipStatus[];

/** The membership chips. */
export const MEMBERSHIP_STATUS_CHIPS = ecoStatusChipMaps<PocketBaseMembershipStatus>(
  MEMBERSHIP_STATUSES,
  {
    TRIAL: { type: 'info', icon: 'hourglass_top' },
    ACTIVE: { type: 'success', icon: 'verified' },
    INACTIVE: { type: 'neutral', icon: 'pause' },
    SUSPENDED: { type: 'error', icon: 'block' },
  },
  'members.status'
);

/**
 * `tenant_requests.status` (eco-admin REQUIREMENTS §5.6; the collection lands with B-35). The
 * resolution labels of the Resolts segment («Executada», «Resposta enviada») are derived from type
 * and status, never stored, and are not part of this family.
 */
export const TENANT_REQUEST_STATUSES = ['PENDING', 'PROCESSED', 'DISMISSED'] as const;

/** The status of a request to a tenant: signup, contact, exit or account deletion. */
export type EcoTenantRequestStatus = (typeof TENANT_REQUEST_STATUSES)[number];

/** The request chips. */
export const TENANT_REQUEST_STATUS_CHIPS = ecoStatusChipMaps<EcoTenantRequestStatus>(
  TENANT_REQUEST_STATUSES,
  {
    PENDING: { type: 'warning', icon: 'schedule' },
    PROCESSED: { type: 'success', icon: 'done' },
    DISMISSED: { type: 'neutral', icon: 'cancel' },
  },
  'requests.status'
);

/**
 * The states of a `member_allowlist` row (eco-admin REQUIREMENTS §5.7; the collection lands with
 * B-36). They are derived, never stored: `PENDING` has neither `usedAt` nor `revoked`, `CONSUMED`
 * has `usedAt`, `REVOKED` has `revoked`.
 */
export const MEMBER_ALLOWLIST_STATUSES = ['PENDING', 'CONSUMED', 'REVOKED'] as const;

/** The derived state of an invitation on a tenant's member allowlist. */
export type EcoMemberAllowlistStatus = (typeof MEMBER_ALLOWLIST_STATUSES)[number];

/** The allowlist chips. */
export const MEMBER_ALLOWLIST_STATUS_CHIPS = ecoStatusChipMaps<EcoMemberAllowlistStatus>(
  MEMBER_ALLOWLIST_STATUSES,
  {
    PENDING: { type: 'info', icon: 'mail' },
    CONSUMED: { type: 'success', icon: 'how_to_reg' },
    REVOKED: { type: 'error', icon: 'link_off' },
  },
  'allowlist.status'
);
