// Pure, runtime-agnostic helpers for per-tenant PWA identity (BUG-003).
// Kept free of Cloudflare globals (HTMLRewriter, fetch `cf`) so they are unit
// testable; the worker glue lives in `server.ts`.

/**
 * @description Tenant identity used to brand the PWA manifest and document head.
 */
export interface TenantBranding {
  name: string;
  shortName: string;
  logoUrl?: string;
}

/**
 * @description Subset of the PocketBase `tenants` record the worker reads.
 */
export interface TenantRecord {
  id?: string;
  collectionId?: string;
  name?: string;
  shortName?: string;
  logo?: string;
}

/** Subdomains that are not tenant slugs (mirror of `EcoStoreTenantService.resolveSlug`). */
export const SKIP_SUBDOMAIN_PREFIXES = ['www', 'admin'];

/** Hosts with no tenant: serve the generic manifest and skip head injection. */
export const NON_TENANT_HOSTS = new Set(['localhost', '127.0.0.1', '9botiga.top']);

/**
 * Generic fallback manifest, served when no tenant resolves from the host.
 * Mirrors `apps/eco-store/public/manifest.webmanifest`; inlined because the
 * worker intercepts `/manifest.webmanifest` and must not re-fetch that path.
 */
export const BASE_MANIFEST = {
  $schema: 'https://json.schemastore.org/web-manifest.json',
  name: 'Botiga Eco',
  short_name: 'Eco',
  description: 'La teva botiga en línia de productes ecològics',
  icons: [
    { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    {
      src: '/icons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/icons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
    { src: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
  theme_color: '#f8faf0',
  background_color: '#f8faf0',
  display: 'standalone',
  start_url: '/',
} as const;

/**
 * @description Derives the tenant slug from the request host (mirrors `EcoStoreTenantService.resolveSlug`).
 * @param {string} hostname The request hostname.
 * @returns {string | null} The tenant slug, or null for non-tenant hosts.
 */
export function resolveTenantSlug(hostname: string): string | null {
  if (NON_TENANT_HOSTS.has(hostname) || hostname.endsWith('.test')) return null;
  const parts = hostname.split('.');
  const candidate = SKIP_SUBDOMAIN_PREFIXES.includes(parts[0]) ? parts[1] : parts[0];
  const slug = candidate?.replace(/[^a-z0-9-]/gi, '') ?? '';

  // A bare host with a single label (e.g. "localhost") is not a tenant.
  return slug && parts.length > 1 ? slug : null;
}

/**
 * @description Maps a PocketBase tenant record into branding, applying the short_name fallback and logo URL.
 * @param {TenantRecord | undefined} record The tenant record (first list item), if any.
 * @param {string} pocketBaseUrl The PocketBase base URL (with trailing slash).
 * @returns {TenantBranding | null} The branding, or null when the record has no name.
 */
export function tenantRecordToBranding(
  record: TenantRecord | undefined,
  pocketBaseUrl: string
): TenantBranding | null {
  if (!record?.name) return null;

  return {
    name: record.name,
    shortName: record.shortName?.trim() || record.name.substring(0, 12),
    logoUrl:
      record.logo && record.collectionId && record.id
        ? `${pocketBaseUrl}api/files/${record.collectionId}/${record.id}/${record.logo}`
        : undefined,
  };
}

/**
 * @description Builds the PWA manifest, branded per tenant when branding is available.
 * @param {TenantBranding | null} branding The resolved tenant branding.
 * @returns {Record<string, unknown>} The manifest object.
 */
export function buildManifest(branding: TenantBranding | null): Record<string, unknown> {
  if (!branding) return { ...BASE_MANIFEST };

  const manifest: Record<string, unknown> = {
    ...BASE_MANIFEST,
    name: branding.name,
    short_name: branding.shortName,
  };

  if (branding.logoUrl) {
    manifest['icons'] = [
      { src: branding.logoUrl, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: branding.logoUrl, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ];
  }

  return manifest;
}

/**
 * @description Escapes a string for safe interpolation into a double-quoted HTML attribute.
 * @param {string} value The raw value.
 * @returns {string} The escaped value.
 */
export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
