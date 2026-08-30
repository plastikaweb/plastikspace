/// <reference types="@cloudflare/workers-types" />
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { environment } from './environments/environment';
import SECURITY_HEADERS from './security-headers.json' with { type: 'json' };
import {
  buildManifest,
  escapeAttribute,
  resolveTenantSlug,
  TenantBranding,
  TenantRecord,
  tenantRecordToBranding,
} from './tenant-branding';

const engine = new AngularAppEngine({
  allowedHosts: ['9botiga.top', '*.9botiga.top', 'localhost', '127.0.0.1', '*.test'],
});

// --- Per-tenant PWA identity (BUG-003) -------------------------------------
// iOS Safari "Add to Home Screen" reads the SERVER-rendered document only: it
// ignores JS-injected/blob manifests and JS-set titles. So tenant PWA identity
// (manifest name/short_name/icons + `apple-mobile-web-app-title`) must be
// emitted by this worker, which is the single entry point for every request and
// the only place that sees the request `Host`. Pure helpers live in
// `tenant-branding.ts`; the Cloudflare-specific glue lives here.

const POCKETBASE_URL = environment.baseApiUrl;
/** Edge-cache TTL (seconds) for the unauthenticated tenant lookup. */
const TENANT_CACHE_TTL = 300;
/** Browser cache TTL (seconds) for the per-tenant manifest. */
const MANIFEST_MAX_AGE = 3600;
/** Hard timeout (ms) for the tenant lookup so a slow PocketBase never stalls TTFB. */
const TENANT_FETCH_TIMEOUT_MS = 1500;

/**
 * @description Resolves tenant branding from the host via an unauthenticated PocketBase lookup.
 * @param {string} hostname The request hostname.
 * @returns {Promise<TenantBranding | null>} The tenant branding, or null when unresolved.
 */
async function resolveBranding(hostname: string): Promise<TenantBranding | null> {
  const slug = resolveTenantSlug(hostname);

  if (!slug) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TENANT_FETCH_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      filter: `(normalizedName='${slug}' && active=true)`,
      fields: 'id,collectionId,name,shortName,logo',
      perPage: '1',
      skipTotal: '1',
    });
    const res = await fetch(`${POCKETBASE_URL}api/collections/tenants/records?${params}`, {
      cf: { cacheTtl: TENANT_CACHE_TTL, cacheEverything: true },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { items?: TenantRecord[] };

    return tenantRecordToBranding(data.items?.[0], POCKETBASE_URL);
  } catch {
    // Timeout / network / JSON failures fall back to the generic identity.
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * @description Injects the iOS PWA identity meta tags into the rendered document head.
 * `apple-mobile-web-app-title` is the load-bearing tag iOS uses for the home-screen name.
 * @param {Response} response The HTML response to transform.
 * @param {TenantBranding} branding The resolved tenant branding.
 * @returns {Response} The transformed response.
 */
function injectPwaHead(response: Response, branding: TenantBranding): Response {
  const title = escapeAttribute(branding.name);

  return new HTMLRewriter()
    .on('head', {
      element(head) {
        head.append(`<meta name="apple-mobile-web-app-title" content="${title}">`, { html: true });
        head.append(`<meta name="apple-mobile-web-app-capable" content="yes">`, { html: true });
        head.append(`<meta name="mobile-web-app-capable" content="yes">`, { html: true });
      },
    })
    .transform(response);
}

/**
 * @description Applies the workspace security headers to a response, relaxing them for local dev.
 * @param {Response} response The response to secure.
 * @param {boolean} isLocalDev True when serving a local development host.
 * @returns {Response} A new response carrying the security headers.
 */
function applySecurityHeaders(response: Response, isLocalDev: boolean): Response {
  const secureResponse = new Response(response.body, response);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (isLocalDev) {
      if (key === 'Strict-Transport-Security') continue;
      if (key === 'Content-Security-Policy') {
        secureResponse.headers.set(
          key,
          value
            .replace('upgrade-insecure-requests;', '')
            .replace('connect-src ', 'connect-src http://127.0.0.1:8090 http://localhost:8090 ')
            .replace('img-src ', 'img-src http://127.0.0.1:8090 http://localhost:8090 ')
            .trim()
        );
        continue;
      }
    }
    secureResponse.headers.set(key, value);
  }

  return secureResponse;
}

/**
 * @description Returns a copy of `req` with a trailing slash appended to its pathname.
 * @param {Request } req The request to append a trailing slash to.
 * @returns {Request} The request with a trailing slash appended to its pathname.
 */
function withTrailingSlash(req: Request): Request {
  const u = new URL(req.url);

  u.pathname = u.pathname + '/';

  return new Request(u.toString(), req);
}

/**
 * @description True when the path has no file extension and does not already end with /.
 * @param {string} pathname The path to check.
 * @returns {boolean} True when the path has no file extension and does not already end with /.
 */
function needsTrailingSlash(pathname: string): boolean {
  return !pathname.endsWith('/') && !/\.[^/]+$/.test(pathname);
}

export const reqHandler = createRequestHandler(async request => {
  const url = new URL(request.url);

  const isLocalDev =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.test');

  // Serve a per-tenant PWA manifest from the edge (BUG-003). Intercepted before
  // the static asset so iOS reads the tenant name from the served document.
  if (url.pathname === '/manifest.webmanifest') {
    const branding = await resolveBranding(url.hostname);
    const manifestResponse = new Response(JSON.stringify(buildManifest(branding)), {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': `public, max-age=${MANIFEST_MAX_AGE}`,
      },
    });

    return applySecurityHeaders(manifestResponse, isLocalDev);
  }

  // Pre-normalize: add trailing slash so Angular SSR renders directly instead
  // of issuing a 301 redirect (which hurts Lighthouse and crawlers).
  const engineRequest = needsTrailingSlash(url.pathname) ? withTrailingSlash(request) : request;

  let response = await engine.handle(engineRequest);

  // Belt-and-suspenders: if the engine or the CF ASSETS binding still emits a
  // trailing-slash redirect, follow it internally so the client never sees one.
  if (
    response?.status === 301 ||
    response?.status === 302 ||
    response?.status === 307 ||
    response?.status === 308
  ) {
    const location = response.headers.get('Location');

    if (location) {
      const redirectUrl = new URL(location, request.url);
      const isSameOriginTrailingSlash =
        redirectUrl.origin === url.origin &&
        redirectUrl.pathname === url.pathname + '/' &&
        redirectUrl.search === url.search;

      if (isSameOriginTrailingSlash) {
        response = (await engine.handle(new Request(redirectUrl.toString(), request))) ?? response;
      }
    }
  }

  if (!response) {
    return new Response('Not Found', { status: 404 });
  }

  // Inject per-tenant iOS PWA identity into the served HTML (BUG-003). HTML
  // flows through this worker for both SSR and prerendered routes, so this also
  // covers the prerendered shop landing.
  if ((response.headers.get('Content-Type') ?? '').includes('text/html')) {
    const branding = await resolveBranding(url.hostname);

    if (branding) {
      response = injectPwaHead(response, branding);
    }
  }

  return applySecurityHeaders(response, isLocalDev);
});

export default { fetch: reqHandler };
