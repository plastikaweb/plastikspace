import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PwaManifestService } from './pwa-manifest.service';

describe('PwaManifestService', () => {
  let service: PwaManifestService;
  let appleIcon: HTMLLinkElement;

  const mockData = { name: 'Eco Shop', logo: 'https://example.com/logo.png' };

  beforeEach(() => {
    vi.clearAllMocks();

    appleIcon = document.createElement('link');
    appleIcon.id = 'apple-touch-icon';
    appleIcon.setAttribute('href', '/icons/apple-touch-icon.png');
    document.head.appendChild(appleIcon);

    TestBed.configureTestingModule({ providers: [PwaManifestService] });
    service = TestBed.inject(PwaManifestService);
  });

  afterEach(() => {
    appleIcon.remove();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('applyBranding()', () => {
    it('updates the apple-touch-icon href to the logo URL', () => {
      service.applyBranding(mockData);
      expect(appleIcon.getAttribute('href')).toBe(mockData.logo);
    });

    it('does not touch the apple-touch-icon when no logo is provided', () => {
      service.applyBranding({ name: 'No Logo Coop' });
      expect(appleIcon.getAttribute('href')).toBe('/icons/apple-touch-icon.png');
    });

    it('does nothing when neither name nor logo is provided', () => {
      service.applyBranding({});
      expect(appleIcon.getAttribute('href')).toBe('/icons/apple-touch-icon.png');
    });

    it('does not throw when the apple-touch-icon element is absent', () => {
      appleIcon.remove();
      expect(() => service.applyBranding(mockData)).not.toThrow();
    });
  });

  describe('SSR guard', () => {
    it('does nothing when not running in a browser', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [PwaManifestService, { provide: PLATFORM_ID, useValue: 'server' }],
      });
      const ssrService = TestBed.inject(PwaManifestService);
      ssrService.applyBranding(mockData);
      expect(appleIcon.getAttribute('href')).toBe('/icons/apple-touch-icon.png');
    });
  });
});
