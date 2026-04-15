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

  /**
   * STRATEGY FOR SUBDOMAINS (TENANTS)
   * If the hostname ends with .9botiga.top, we clone the request and change the Host header
   * so that Angular validates it correctly against the ALLOWED_BASE_HOSTS list.
   */
  let finalRequest = request;

  if (url.hostname.endsWith('.9botiga.top') && url.hostname !== '9botiga.top') {
    const headers = new Headers(request.headers);
    headers.set('host', '9botiga.top'); // We trick the SSR engine

    finalRequest = new Request(request, {
      headers,
    });
  }

  const acceptLanguage = request.headers.get('accept-language');
  const lang = acceptLanguage?.split(',')[0].split('-')[0] || 'ca';

  console.log(`[Server] Request: ${url.href}, Target Host: ${url.hostname}, Lang: ${lang}`);

  // Pass the request (possibly modified) to the Angular engine
  const response = await engine.handle(finalRequest);

  if (!response) {
    return new Response('Not Found', { status: 404 });
  }

  // Add security headers to the response
  const secureResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    secureResponse.headers.set(key, value);
  }

  return secureResponse;
});

export default { fetch: reqHandler };
