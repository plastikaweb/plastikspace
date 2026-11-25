import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core';

/**
 * Whether the app renders at build time, on the server with no request.
 * That is the prerender of the static routes and the route extraction. The host is then
 * `localhost`, which names no tenant, so nothing that needs one should reach PocketBase (TECH-18).
 * Call it in an injection context.
 * @returns { boolean } True on the server with no request; false in the browser and for a request
 * the server renders.
 */
export function injectIsBuildTimeRender(): boolean {
  return isPlatformServer(inject(PLATFORM_ID)) && !inject(REQUEST, { optional: true });
}
