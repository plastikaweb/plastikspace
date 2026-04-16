/// <reference types="@cloudflare/workers-types" />
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import SECURITY_HEADERS from './security-headers.json' with { type: 'json' };

const engine = new AngularAppEngine({
  allowedHosts: ['9botiga.top', '*.9botiga.top', 'localhost', '127.0.0.1', '*.test'],
});

export const reqHandler = createRequestHandler(async request => {
  const url = new URL(request.url);

  // Normalize URL: add trailing slash before Angular SSR processes it to prevent
  // a 301 redirect from /path to /path/ that affects Lighthouse and crawlers.
  // Static assets (paths with a file extension) are excluded from normalization.
  const normalizedRequest =
    !url.pathname.endsWith('/') && !/\.[^/]+$/.test(url.pathname)
      ? new Request(
          Object.assign(new URL(request.url), { pathname: url.pathname + '/' }).toString(),
          request
        )
      : request;

  const response = await engine.handle(normalizedRequest);

  if (!response) {
    return new Response('Not Found', { status: 404 });
  }

  const secureResponse = new Response(response.body, response);

  const isLocalDev =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.test');

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
});

export default { fetch: reqHandler };
