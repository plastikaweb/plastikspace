import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PwaManifestService } from './pwa-manifest.service';

describe('PwaManifestService', () => {
  let service: PwaManifestService;
  let manifestLink: HTMLLinkElement;
  let appleIcon: HTMLLinkElement;
  let createObjectURL: ReturnType<typeof vi.spyOn>;
  let revokeObjectURL: ReturnType<typeof vi.spyOn>;

  const mockData = { name: 'Eco Shop', logo: 'https://example.com/logo.png' };

  beforeEach(() => {
    vi.clearAllMocks();

    manifestLink = document.createElement('link');
    manifestLink.id = 'app-manifest';
    document.head.appendChild(manifestLink);

    appleIcon = document.createElement('link');
    appleIcon.id = 'apple-touch-icon';
    document.head.appendChild(appleIcon);

    createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ theme_color: '#fff', display: 'standalone' }),
      })
    );

    TestBed.configureTestingModule({ providers: [PwaManifestService] });
    service = TestBed.inject(PwaManifestService);
  });

  afterEach(() => {
    manifestLink.remove();
    appleIcon.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('applyBranding()', () => {
    it('does nothing when no logo is provided', async () => {
      await service.applyBranding({ name: 'No Logo' });
      expect(createObjectURL).not.toHaveBeenCalled();
    });

    it('fetches the static manifest as the base', async () => {
      await service.applyBranding(mockData);
      expect(fetch).toHaveBeenCalledWith('/manifest.webmanifest');
    });

    it('sets the manifest link href to the generated blob URL', async () => {
      await service.applyBranding(mockData);
      expect(manifestLink.getAttribute('href')).toBe('blob:mock-url');
    });

    it('patches name and short_name when name is provided', async () => {
      let manifest: Record<string, unknown> = {};
      createObjectURL.mockImplementation((blob: Blob) => {
        blob.text().then(t => (manifest = JSON.parse(t)));
        return 'blob:mock-url';
      });
      await service.applyBranding(mockData);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(manifest['name']).toBe('Eco Shop');
      expect(manifest['short_name']).toBe('Eco Shop');
    });

    it('omits name and short_name when name is absent', async () => {
      let manifest: Record<string, unknown> = {};
      createObjectURL.mockImplementation((blob: Blob) => {
        blob.text().then(t => (manifest = JSON.parse(t)));
        return 'blob:mock-url';
      });
      await service.applyBranding({ logo: mockData.logo });
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(manifest['name']).toBeUndefined();
    });

    it('includes two icon entries pointing to the logo URL', async () => {
      let manifest: Record<string, unknown> = {};
      createObjectURL.mockImplementation((blob: Blob) => {
        blob.text().then(t => (manifest = JSON.parse(t)));
        return 'blob:mock-url';
      });
      await service.applyBranding(mockData);
      await new Promise(resolve => setTimeout(resolve, 0));
      const icons = manifest['icons'] as Array<{ src: string }>;
      expect(icons).toHaveLength(2);
      expect(icons.every(i => i.src === mockData.logo)).toBe(true);
    });

    it('preserves base manifest fields from the static file', async () => {
      let manifest: Record<string, unknown> = {};
      createObjectURL.mockImplementation((blob: Blob) => {
        blob.text().then(t => (manifest = JSON.parse(t)));
        return 'blob:mock-url';
      });
      await service.applyBranding(mockData);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(manifest['theme_color']).toBe('#fff');
      expect(manifest['display']).toBe('standalone');
    });

    it('proceeds with an empty base when fetch throws', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
      await service.applyBranding(mockData);
      expect(createObjectURL).toHaveBeenCalled();
    });

    it('proceeds with an empty base when fetch returns a non-ok response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
      await service.applyBranding(mockData);
      expect(createObjectURL).toHaveBeenCalled();
    });

    it('does not throw when the manifest link element is absent', async () => {
      manifestLink.remove();
      await expect(service.applyBranding(mockData)).resolves.not.toThrow();
    });

    it('updates the apple-touch-icon href', async () => {
      await service.applyBranding(mockData);
      expect(appleIcon.getAttribute('href')).toBe(mockData.logo);
    });

    it('does not throw when the apple-touch-icon element is absent', async () => {
      appleIcon.remove();
      await expect(service.applyBranding(mockData)).resolves.not.toThrow();
    });

    it('revokes the previous blob URL on a subsequent call', async () => {
      await service.applyBranding(mockData);
      await service.applyBranding(mockData);
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('SSR guard', () => {
    it('applyBranding() does nothing when not running in a browser', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [PwaManifestService, { provide: PLATFORM_ID, useValue: 'server' }],
      });
      const ssrService = TestBed.inject(PwaManifestService);
      await ssrService.applyBranding(mockData);
      expect(createObjectURL).not.toHaveBeenCalled();
    });
  });

  describe('cleanup on destroy', () => {
    it('revokes the blob URL when the service is destroyed', async () => {
      await service.applyBranding(mockData);
      TestBed.resetTestingModule();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
