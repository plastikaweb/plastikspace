import { Platform } from '@angular/cdk/platform';
import { TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PWA_APP_DATA_FN, PwaInstallService } from './pwa-install.service';

// Stub PwaPromptComponent so showPrompt()'s dynamic import resolves immediately
// without triggering Angular template compilation, making tests deterministic.
vi.mock('../components/pwa-prompt/pwa-prompt.component', () => ({
  PwaPromptComponent: class PwaPromptComponent {},
}));

const DISMISS_KEY = 'eco_pwa_dismissed';
const INSTALLED_KEY = 'eco_pwa_installed';
const DISMISS_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

/**
 * Creates a mock beforeinstallprompt event.
 * @param {'accepted' | 'dismissed'} outcome - The simulated user choice outcome.
 * @returns {Event} The event instance.
 */
function makeInstallEvent(outcome: 'accepted' | 'dismissed' = 'accepted'): Event {
  const e = new Event('beforeinstallprompt');
  Object.assign(e, {
    preventDefault: vi.fn(),
    prompt: vi.fn().mockResolvedValue(undefined),
    userChoice: Promise.resolve({ outcome, platform: '' }),
  });
  return e;
}

describe('PwaInstallService', () => {
  let service: PwaInstallService;
  let bottomSheetOpen: ReturnType<typeof vi.fn>;
  const mockPlatform = { IOS: false, ANDROID: false, SAFARI: false };

  // Pre-warm @angular/material/bottom-sheet so showPrompt()'s Promise.all
  // resolves instantly in tests rather than racing against first-load latency.
  beforeAll(async () => {
    await import('@angular/material/bottom-sheet');
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockPlatform.IOS = false;
    mockPlatform.ANDROID = false;
    mockPlatform.SAFARI = false;
    bottomSheetOpen = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    TestBed.configureTestingModule({
      providers: [
        PwaInstallService,
        { provide: MatBottomSheet, useValue: { open: bottomSheetOpen } },
        { provide: PWA_APP_DATA_FN, useValue: () => ({ name: 'Eco Shop', logo: '' }) },
        { provide: Platform, useValue: mockPlatform },
      ],
    });

    service = TestBed.inject(PwaInstallService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('beforeinstallprompt', () => {
    it('sets promptAvailable to true', () => {
      expect(service.promptAvailable()).toBe(false);
      window.dispatchEvent(makeInstallEvent());
      expect(service.promptAvailable()).toBe(true);
    });

    it('opens the bottom sheet when not previously dismissed', async () => {
      window.dispatchEvent(makeInstallEvent());
      await vi.waitFor(() => expect(bottomSheetOpen).toHaveBeenCalled(), { timeout: 2000 });
    });

    it('does not open a second sheet when the event fires again in the same session', async () => {
      window.dispatchEvent(makeInstallEvent());
      await vi.waitFor(() => expect(bottomSheetOpen).toHaveBeenCalledTimes(1), { timeout: 2000 });
      window.dispatchEvent(makeInstallEvent());
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(bottomSheetOpen).toHaveBeenCalledTimes(1);
    });

    it('does not open the sheet when dismissed within DISMISS_DAYS', async () => {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      window.dispatchEvent(makeInstallEvent());
      // Wait a bit to ensure it doesn't open
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(bottomSheetOpen).not.toHaveBeenCalled();
    });

    it('opens the sheet when dismissal is older than DISMISS_DAYS', async () => {
      localStorage.setItem(DISMISS_KEY, String(Date.now() - DISMISS_DAYS_MS - 1000));
      window.dispatchEvent(makeInstallEvent());
      await vi.waitFor(() => expect(bottomSheetOpen).toHaveBeenCalled(), { timeout: 2000 });
    });

    it('does not open the sheet when already installed', async () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      window.dispatchEvent(makeInstallEvent());
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(bottomSheetOpen).not.toHaveBeenCalled();
    });
  });

  describe('appinstalled', () => {
    it('clears promptAvailable and marks installed in localStorage', () => {
      service.promptAvailable.set(true);
      window.dispatchEvent(new Event('appinstalled'));
      expect(service.promptAvailable()).toBe(false);
      expect(localStorage.getItem(INSTALLED_KEY)).toBe('1');
      expect(localStorage.getItem(DISMISS_KEY)).toBeNull();
    });
  });

  describe('isIos()', () => {
    it('returns true when platform is iOS and not standalone', () => {
      mockPlatform.IOS = true;
      expect(service.isIos()).toBe(true);
    });

    it('returns false when already in standalone mode', () => {
      mockPlatform.IOS = true;
      vi.spyOn(service, 'isStandalone').mockReturnValue(true);
      expect(service.isIos()).toBe(false);
    });
  });

  describe('isIosAndNotSafari()', () => {
    beforeEach(() => {
      mockPlatform.IOS = true;
    });

    it('returns false when not on iOS', () => {
      mockPlatform.IOS = false;
      expect(service.isIosAndNotSafari()).toBe(false);
    });

    it('returns false when in standalone mode', () => {
      vi.spyOn(service, 'isStandalone').mockReturnValue(true);
      expect(service.isIosAndNotSafari()).toBe(false);
    });

    it('returns false for a standard Safari UA', () => {
      vi.stubGlobal('navigator', {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Version/17.4.1 Mobile/15E148 Safari/604.1',
      });
      expect(service.isIosAndNotSafari()).toBe(false);
    });

    it.each([
      [
        'Chrome (CriOS)',
        'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 CriOS/123.0 Mobile/15E148 Safari/604.1',
      ],
      [
        'Edge (EdgiOS)',
        'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 EdgiOS/123.0 Mobile/15E148 Safari/604.1',
      ], // cspell:ignore EdgiOS
      [
        'Firefox (FxiOS)',
        'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 FxiOS/123.0 Mobile/15E148 Safari/604.1',
      ],
      [
        'Opera (OPiOS)',
        'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 OPiOS/18.0 Mobile/15E148 Safari/604.1',
      ],
    ])('returns true for iOS %s', (_, ua) => {
      vi.stubGlobal('navigator', { userAgent: ua });
      expect(service.isIosAndNotSafari()).toBe(true);
    });
  });

  describe('isOldIos()', () => {
    it('identifies iOS version < 17', () => {
      mockPlatform.IOS = true;
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)',
      });
      expect(service.isOldIos()).toBe(true);
    });

    it('identifies iOS version >= 17', () => {
      mockPlatform.IOS = true;
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)',
      });
      expect(service.isOldIos()).toBe(false);
    });

    it('returns false if not iOS', () => {
      mockPlatform.IOS = false;
      expect(service.isOldIos()).toBe(false);
    });
  });

  describe('isStandalone()', () => {
    it('returns false when matchMedia does not match', () => {
      expect(service.isStandalone()).toBe(false);
    });

    it('returns true when matchMedia matches standalone', () => {
      (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({ matches: true });
      expect(service.isStandalone()).toBe(true);
    });
  });

  describe('shouldShowPrompt()', () => {
    it('returns true when never dismissed or installed', () => {
      expect(service.shouldShowPrompt()).toBe(true);
    });

    it('returns false when already installed', () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      expect(service.shouldShowPrompt()).toBe(false);
    });

    it('returns false when dismissed within DISMISS_DAYS', () => {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      expect(service.shouldShowPrompt()).toBe(false);
    });

    it('returns true when dismissed more than DISMISS_DAYS ago', () => {
      localStorage.setItem(DISMISS_KEY, String(Date.now() - DISMISS_DAYS_MS - 1000));
      expect(service.shouldShowPrompt()).toBe(true);
    });
  });

  describe('dismissForLater()', () => {
    it('stores a timestamp and sets promptAvailable to false', () => {
      service.promptAvailable.set(true);
      service.dismissForLater();
      expect(localStorage.getItem(DISMISS_KEY)).toBeTruthy();
      expect(service.promptAvailable()).toBe(false);
    });
  });

  describe('installPwa()', () => {
    it('returns no-prompt when no deferred prompt is stored', async () => {
      const result = await service.installPwa();
      expect(result).toBe('no-prompt');
    });

    it('returns accepted and marks installed when user accepts', async () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      window.dispatchEvent(makeInstallEvent('accepted'));
      const result = await service.installPwa();
      expect(result).toBe('accepted');
      expect(localStorage.getItem(INSTALLED_KEY)).toBe('1');
      expect(service.promptAvailable()).toBe(false);
    });

    it('returns dismissed and stores dismiss timestamp when user dismisses', async () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      window.dispatchEvent(makeInstallEvent('dismissed'));
      const result = await service.installPwa();
      expect(result).toBe('dismissed');
      expect(localStorage.getItem(DISMISS_KEY)).toBeTruthy();
    });

    it('returns no-prompt when prompt() times out', async () => {
      vi.useFakeTimers();
      localStorage.setItem(INSTALLED_KEY, '1');
      const event = new Event('beforeinstallprompt');
      Object.assign(event, {
        preventDefault: vi.fn(),
        prompt: vi.fn().mockReturnValue(new Promise(() => {})),
        userChoice: Promise.resolve({ outcome: 'accepted', platform: '' }),
      });
      window.dispatchEvent(event);

      const resultPromise = service.installPwa();
      await vi.advanceTimersByTimeAsync(10_001);
      const result = await resultPromise;
      expect(result).toBe('no-prompt');
      vi.useRealTimers();
    });
  });
});
