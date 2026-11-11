import { DefaultUrlSerializer } from '@angular/router';

import { ECO_ADMIN_LOGIN_URL } from './eco-admin-roles';

// Any ASCII control character, DEL included. A browser strips tab and line breaks from a URL
// before it resolves it, so `/\t/evil.example` would otherwise turn into `//evil.example`.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

/**
 * Tells whether a path is the login screen itself, with or without a query, a fragment or a child path.
 * @param {string} path The candidate path.
 * @returns {boolean} True when following it would land on the login screen again.
 */
function isLoginUrl(path: string): boolean {
  if (!path.startsWith(ECO_ADMIN_LOGIN_URL)) {
    return false;
  }

  const next = path.charAt(ECO_ADMIN_LOGIN_URL.length);

  return next === '' || next === '/' || next === '?' || next === '#' || next === ';';
}

/**
 * Validates the `returnUrl` a visitor arrives at the login screen with.
 *
 * The value comes from the address bar, so anyone can write it. It is followed only when it is a path
 * inside this application: a single leading slash, no backslash, no control character, and not the login
 * screen itself. Anything else falls back, which closes the open redirect (`//evil.example`,
 * `/\evil.example`) and the login-to-login loop.
 * @param {string | null | undefined} raw The value of the `returnUrl` query parameter.
 * @param {string} fallback Where to go when the value is missing or not acceptable.
 * @returns {string} A path that is safe to hand to the router.
 */
export function resolveReturnUrl(raw: string | null | undefined, fallback: string): string {
  if (!raw || raw.charAt(0) !== '/' || raw.charAt(1) === '/') {
    return fallback;
  }

  if (raw.includes('\\') || CONTROL_CHARACTERS.test(raw) || isLoginUrl(raw)) {
    return fallback;
  }

  try {
    new DefaultUrlSerializer().parse(raw);
  } catch {
    return fallback;
  }

  return raw;
}
