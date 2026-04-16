/// <reference types="@cloudflare/workers-types" />
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import SECURITY_HEADERS from './security-headers.json' with { type: 'json' };

const engine = new AngularAppEngine({
  allowedHosts: ['9botiga.top', '*.9botiga.top', 'localhost', '127.0.0.1', '*.test'],
});

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

  // Pre-normalize: add trailing slash so Angular SSR renders directly instead
  // of issuing a 301 redirect (which hurts Lighthouse and crawlers).
  const engineRequest = needsTrailingSlash(url.pathname) ? withTrailingSlash(request) : request;

  let response = await engine.handle(engineRequest);

  // Belt-and-suspenders: if Angular SSR still emits a trailing-slash redirect,
  // follow it internally so the client never sees a 301.
  if (response?.status === 301 || response?.status === 302) {
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
