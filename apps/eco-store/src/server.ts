/// <reference types="@cloudflare/workers-types" />
/* eslint-disable no-console */
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

// We only need to list the "base" domains.
// Any subdomain will be converted to these before reaching Angular.
const ALLOWED_BASE_HOSTS = [
  '9botiga.top',
  'localhost',
  '127.0.0.1',
  'el-llevat.test',
  'plastikaweb.test',
  'acme.test',
];

const engine = new AngularAppEngine({
  allowedHosts: ALLOWED_BASE_HOSTS,
});

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://eco-botiga.pockethost.io; connect-src 'self' https://eco-botiga.pockethost.io https://fonts.gstatic.com https://fonts.googleapis.com; frame-ancestors 'none'; upgrade-insecure-requests;",
};

export const reqHandler = createRequestHandler(async request => {
  const url = new URL(request.url);

  // ... (el teu codi actual de routing i subdominis) ...

  const response = await engine.handle(request);

  if (!response) {
    return new Response('Not Found', { status: 404 });
  }

  // Add security headers to the response
  const secureResponse = new Response(response.body, response);

  // Detect if we are in local development
  const isLocalDev =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.test');

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (isLocalDev) {
      // Don't send HSTS in local to avoid SSL blocking
      if (key === 'Strict-Transport-Security') {
        continue;
      }
      // Remove upgrade-insecure-requests from CSP in local
      if (key === 'Content-Security-Policy') {
        const localCsp = value
          .replace('upgrade-insecure-requests;', '')
          .replace('connect-src ', 'connect-src http://127.0.0.1:8090 http://localhost:8090 ')
          .replace('img-src ', 'img-src http://127.0.0.1:8090 http://localhost:8090 ')
          .trim();
        secureResponse.headers.set(key, localCsp);
        continue;
      }
    }
    secureResponse.headers.set(key, value);
  }

  return secureResponse;
});

export default { fetch: reqHandler };
