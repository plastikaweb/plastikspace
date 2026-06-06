import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { PwaAppData } from './pwa-install.service';

@Injectable({ providedIn: 'root' })
/**
 * @description Optional service that patches the web app manifest and apple-touch-icon with dynamic branding.
 */
export class PwaManifestService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #window = signal(this.#document?.defaultView);

  #manifestBlobUrl: string | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#revokeBlobUrl());
  }

  /**
   * @description Fetches the static manifest, patches the name when provided and the icons when a logo is provided, and applies it as a Blob URL.
   * @param {PwaAppData} data - App identity data; logo, when present, must be an absolute URL.
   * @returns {Promise<void>}
   */
  async applyBranding(data: PwaAppData): Promise<void> {
    if (!isPlatformBrowser(this.#platformId) || (!data.name && !data.logo)) return;
    await this.#updateManifest(data);
    this.#updateAppleTouchIcon(data);
  }

  /**
   * @description Fetches the current static manifest, merges dynamic branding, and replaces the manifest link with a Blob URL.
   * @param {PwaAppData} data - App identity data; icons are only patched when a logo is provided.
   * @returns {Promise<void>}
   */
  async #updateManifest(data: PwaAppData): Promise<void> {
    const manifestLink = this.#document.getElementById('app-manifest') as HTMLLinkElement | null;
    if (!manifestLink) return;

    let base: Record<string, unknown> = {};
    try {
      const res = await fetch('/manifest.webmanifest');
      if (res.ok) {
        base = await res.json();
      }
    } catch {
      // Proceed with empty base if the static manifest is unreachable.
    }

    this.#revokeBlobUrl();

    const origin = this.#window()?.location.origin ?? '';
    const patch: Record<string, unknown> = {
      start_url: `${origin}/`,
    };

    if (data.logo) {
      patch['icons'] = [
        { src: data.logo, sizes: '512x512', purpose: 'any' },
        { src: data.logo, sizes: '512x512', purpose: 'maskable' },
      ];
    }

    if (data.name) {
      patch['name'] = data.name;
      patch['short_name'] = data.shortName || data.name.substring(0, 12);
    }

    const manifest = { ...base, ...patch };
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
    this.#manifestBlobUrl = URL.createObjectURL(blob);
    manifestLink.setAttribute('href', this.#manifestBlobUrl);
  }

  /**
   * @description Updates the apple-touch-icon href for iOS Add to Home Screen.
   * @param {PwaAppData} data - App identity data with an absolute logo URL.
   */
  #updateAppleTouchIcon(data: PwaAppData): void {
    if (!data.logo) return;
    const appleIcon = this.#document.getElementById('apple-touch-icon') as HTMLLinkElement | null;
    appleIcon?.setAttribute('href', data.logo);
  }

  /** Revokes the current manifest blob URL to prevent memory leaks. */
  #revokeBlobUrl(): void {
    if (this.#manifestBlobUrl) {
      URL.revokeObjectURL(this.#manifestBlobUrl);
      this.#manifestBlobUrl = null;
    }
  }
}
