/**
 * Compatibility re-export (AREF-01). The eco domain entities live in
 * `@plastik/eco/entities` so that eco-admin can share them; this alias keeps the
 * existing eco-store imports working. New code imports from
 * `@plastik/eco/entities` directly.
 */
export * from '@plastik/eco/entities';
