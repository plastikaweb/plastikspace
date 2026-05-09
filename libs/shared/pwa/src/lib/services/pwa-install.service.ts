import { Platform } from '@angular/cdk/platform';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  PLATFORM_ID,
  runInInjectionContext,
  signal,
} from '@angular/core';

const DISMISS_KEY = 'eco_pwa_dismissed';
const INSTALLED_KEY = 'eco_pwa_installed';
const DISMISS_DAYS = 15;
const PROMPT_TIMEOUT_MS = 10_000;

/**
 * @description Interface for the beforeinstallprompt event.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * @description Interface for the PWA app data.
 */
export interface PwaAppData {
  name?: string;
  logo?: string;
  defaultLogo?: string;
}

/** Provide a factory function that returns current app identity data for the install prompt. */
export const PWA_APP_DATA_FN = new InjectionToken<() => PwaAppData>('PWA_APP_DATA_FN', {
  providedIn: 'root',
  factory: () => () => ({}),
});

@Injectable({ providedIn: 'root' })
/**
 * @description Service for managing PWA installation, native install prompts, and tenant branding.
 */
export class PwaInstallService {
  readonly #document = inject(DOCUMENT);
  readonly #injector = inject(Injector);
  readonly #getAppData = inject(PWA_APP_DATA_FN);
  readonly #destroyRef = inject(DestroyRef);
  readonly #platform = inject(Platform);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #window = signal(this.#document?.defaultView);

  #deferredPrompt: BeforeInstallPromptEvent | null = null;
  #promptShown = false;
  #destroyed = false;
  readonly promptAvailable = signal(false);

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.#destroyed = true;
    });

    if (!isPlatformBrowser(this.#platformId) || this.isStandalone()) return;

    const controller = new AbortController();

    this.#window()?.addEventListener(
      'beforeinstallprompt',
      e => {
        e.preventDefault();
        this.#deferredPrompt = e as BeforeInstallPromptEvent;
        this.promptAvailable.set(true);
        if (this.shouldShowPrompt()) {
          this.showPrompt();
        }
      },
      { signal: controller.signal }
    );

    this.#window()?.addEventListener(
      'appinstalled',
      () => {
        this.#deferredPrompt = null;
        this.promptAvailable.set(false);
        localStorage.setItem(INSTALLED_KEY, '1');
        localStorage.removeItem(DISMISS_KEY);
      },
      { signal: controller.signal }
    );

    this.#destroyRef.onDestroy(() => controller.abort());
  }

  /**
   * @description Opens the PWA install prompt bottom sheet.
   * MatBottomSheet and PwaPromptComponent are lazily imported to keep them out of the initial bundle.
   */
  showPrompt(): void {
    if (!isPlatformBrowser(this.#platformId) || this.#promptShown) return;
    this.#promptShown = true;
    const data = this.#getAppData();
    const injector = this.#injector;
    Promise.all([
      import('@angular/material/bottom-sheet'),
      import('../components/pwa-prompt/pwa-prompt.component'),
    ]).then(([{ MatBottomSheet }, { PwaPromptComponent }]) => {
      if (this.#destroyed) return;
      runInInjectionContext(injector, () =>
        inject(MatBottomSheet).open(PwaPromptComponent, {
          data,
          backdropClass: 'pwa-backdrop',
        })
      );
    });
  }

  /**
   * @description Returns true if the app is running on iOS and not already installed.
   * @returns {boolean} True on iOS outside of standalone mode.
   */
  isIos(): boolean {
    return this.#platform.IOS && !this.isStandalone();
  }

  /**
   * @description Returns true if running on iOS with a non-Safari browser.
   * CDK Platform.SAFARI is unreliable on iOS because all iOS browsers share Apple's
   * WebKit/vendor, so this uses User Agent sniffing to detect Chromium (CriOS),
   * Edge (EdgiOS), Firefox (FxiOS) and Opera (OPiOS) specifically.
   * @returns {boolean} True when iOS + non-Safari browser detected.
   */
  isIosAndNotSafari(): boolean {
    if (!this.#platform.IOS || this.isStandalone()) return false;
    const ua = this.#window()?.navigator.userAgent ?? '';
    return /CriOS|EdgiOS|FxiOS|OPiOS/.test(ua); // cspell:ignore EdgiOS OPiOS
  }

  /**
   * @description Returns true if the current iOS version is older than 17.
   * On iOS < 17 the Share button is in a different location.
   * @returns {boolean} True for iOS < 17.
   */
  isOldIos(): boolean {
    if (!this.#platform.IOS || !this.#window()?.navigator) return false;
    const match = this.#window()?.navigator.userAgent.match(/OS (\d+)_/);
    if (match?.[1]) {
      return parseInt(match[1], 10) < 17;
    }
    return false;
  }

  /**
   * @description Returns true if the app is running in standalone (installed PWA) mode.
   * @returns {boolean} True in standalone display mode.
   */
  isStandalone(): boolean {
    const win = this.#window();
    if (!win || typeof win.matchMedia !== 'function') return false;
    return win.matchMedia('(display-mode: standalone)').matches;
  }

  /**
   * @description Triggers the native browser install prompt.
   * @returns {Promise<'accepted' | 'dismissed' | 'no-prompt'>} The result of the installation attempt.
   */
  async installPwa(): Promise<'accepted' | 'dismissed' | 'no-prompt'> {
    const deferred = this.#deferredPrompt;
    if (!deferred) return 'no-prompt';
    try {
      // Browsers may hang on prompt() in simulated/unsupported environments — time out after 10 s.
      await Promise.race([
        deferred.prompt(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), PROMPT_TIMEOUT_MS)
        ),
      ]);
      const choice = await deferred.userChoice;
      if (choice?.outcome === 'accepted') {
        this.#window()?.localStorage.setItem(INSTALLED_KEY, '1');
        this.#window()?.localStorage.removeItem(DISMISS_KEY);
        this.#deferredPrompt = null;
        this.promptAvailable.set(false);
        return 'accepted';
      }
      this.dismissForLater();
      return 'dismissed';
    } catch {
      this.#deferredPrompt = null;
      this.promptAvailable.set(false);
      return 'no-prompt';
    }
  }

  /**
   * @description Suppresses the install prompt for DISMISS_DAYS days.
   */
  dismissForLater(): void {
    this.#window()?.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    this.promptAvailable.set(false);
  }

  /**
   * @description Returns true if the install prompt should be shown based on installation status and dismissal history.
   * @returns {boolean} True if prompt should be shown.
   */
  shouldShowPrompt(): boolean {
    if (this.#window()?.localStorage.getItem(INSTALLED_KEY)) return false;
    const dismissed = this.#window()?.localStorage.getItem(DISMISS_KEY);
    if (!dismissed) return true;
    const daysSince = (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24);
    return daysSince >= DISMISS_DAYS;
  }
}
