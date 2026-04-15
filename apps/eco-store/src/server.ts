/// <reference types="@cloudflare/workers-types" />
/* eslint-disable no-console */
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

// Define your production domains here or pull from environment variables
const productionHosts = [
  'eco-store.pages.dev', // Cloudflare default
  '9botiga.top', // Your custom domain
];

const engine = new AngularAppEngine({
  allowedHosts: [
    'el-llevat.test',
    'plastikaweb.test',
    'acme.test',
    'localhost',
    '127.0.0.1',
    ...productionHosts,
  ],
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
  const acceptLanguage = request.headers.get('accept-language');
  const lang = acceptLanguage?.split(',')[0].split('-')[0] || 'ca';

  console.log(`[Server] Request: ${request.url}, Lang from header: ${lang}, Origin: ${url.origin}`);

  const response = await engine.handle(request);
  if (!response) {
    return new Response('Not Found', { status: 404 });
  }

  const secureResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    secureResponse.headers.set(key, value);
  }
  return secureResponse;
});

export default { fetch: reqHandler };
