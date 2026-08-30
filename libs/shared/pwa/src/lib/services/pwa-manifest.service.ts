import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PwaAppData } from './pwa-install.service';

@Injectable({ providedIn: 'root' })
/**
 * @description Applies dynamic branding to the apple-touch-icon for browsers that read it client-side.
 *
 * The PWA manifest identity (name, short_name, icons) and the iOS
 * `apple-mobile-web-app-title` are served per-tenant by the SSR worker
 * (`apps/eco-store/src/server.ts`), because iOS "Add to Home Screen" reads the
 * server-rendered document and ignores JS-injected/blob manifests. This service
 * therefore no longer patches the manifest link.
 */
export class PwaManifestService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);

  /**
   * @description Updates the apple-touch-icon href with the tenant logo when one is provided.
   * @param {PwaAppData} data - App identity data; the icon is only updated when a logo is present.
   * @returns {void}
   */
  applyBranding(data: PwaAppData): void {
    if (!isPlatformBrowser(this.#platformId) || !data.logo) return;
    const appleIcon = this.#document.getElementById('apple-touch-icon') as HTMLLinkElement | null;

    appleIcon?.setAttribute('href', data.logo);
  }
}
