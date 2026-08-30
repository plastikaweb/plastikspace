import {
  BASE_MANIFEST,
  buildManifest,
  escapeAttribute,
  resolveTenantSlug,
  tenantRecordToBranding,
} from './tenant-branding';

const PB_URL = 'https://eco-botiga.pockethost.io/';

describe('resolveTenantSlug', () => {
  it('uses the leading subdomain as the slug', () => {
    expect(resolveTenantSlug('el-llevat.9botiga.top')).toBe('el-llevat');
  });

  it('skips the www prefix', () => {
    expect(resolveTenantSlug('www.el-llevat.9botiga.top')).toBe('el-llevat');
  });

  it('skips the admin prefix', () => {
    expect(resolveTenantSlug('admin.el-llevat.9botiga.top')).toBe('el-llevat');
  });

  it.each(['9botiga.top', 'localhost', '127.0.0.1', 'el-llevat.test', 'tenant.test'])(
    'returns null for non-tenant host %s',
    host => {
      expect(resolveTenantSlug(host)).toBeNull();
    }
  );
});

describe('tenantRecordToBranding', () => {
  const record = {
    id: 'tcqkp8j1h6uzext',
    collectionId: 'pbc_2442875294',
    name: 'El Llevat',
    shortName: '',
    logo: 'logo_abc.png',
  };

  it('returns null when no record is provided', () => {
    expect(tenantRecordToBranding(undefined, PB_URL)).toBeNull();
  });

  it('returns null when the record has no name', () => {
    expect(tenantRecordToBranding({ id: 'x', collectionId: 'y' }, PB_URL)).toBeNull();
  });

  it('falls back to a 12-char truncation of the name when shortName is empty', () => {
    const branding = tenantRecordToBranding({ ...record, name: 'Associació El Llevat' }, PB_URL);

    expect(branding?.shortName).toBe('Associació E');
  });

  it('uses an explicit, trimmed shortName when present', () => {
    const branding = tenantRecordToBranding({ ...record, shortName: '  El Llevat  ' }, PB_URL);

    expect(branding?.shortName).toBe('El Llevat');
  });

  it('builds the absolute logo URL from the file path parts', () => {
    const branding = tenantRecordToBranding(record, PB_URL);

    expect(branding?.logoUrl).toBe(
      'https://eco-botiga.pockethost.io/api/files/pbc_2442875294/tcqkp8j1h6uzext/logo_abc.png'
    );
  });

  it('leaves the logo URL undefined when no logo file is set', () => {
    const branding = tenantRecordToBranding({ ...record, logo: '' }, PB_URL);

    expect(branding?.logoUrl).toBeUndefined();
  });
});

describe('buildManifest', () => {
  it('returns the generic manifest when no branding resolves', () => {
    const manifest = buildManifest(null);

    expect(manifest['name']).toBe('Botiga Eco');
    expect(manifest['short_name']).toBe('Eco');
    expect(manifest['icons']).toEqual(BASE_MANIFEST.icons);
  });

  it('overrides name and short_name and keeps base icons when there is no logo', () => {
    const manifest = buildManifest({ name: 'El Llevat', shortName: 'El Llevat' });

    expect(manifest['name']).toBe('El Llevat');
    expect(manifest['short_name']).toBe('El Llevat');
    expect(manifest['icons']).toEqual(BASE_MANIFEST.icons);
  });

  it('uses the tenant logo for both icon purposes when a logo is present', () => {
    const logoUrl = 'https://eco-botiga.pockethost.io/api/files/c/i/logo.png';
    const manifest = buildManifest({ name: 'El Llevat', shortName: 'El Llevat', logoUrl });
    const icons = manifest['icons'] as { src: string; purpose: string }[];

    expect(icons).toHaveLength(2);
    expect(icons.every(icon => icon.src === logoUrl)).toBe(true);
    expect(icons.map(icon => icon.purpose)).toEqual(['any', 'maskable']);
  });

  it('does not mutate the shared base manifest', () => {
    buildManifest({ name: 'El Llevat', shortName: 'El Llevat' });
    expect(BASE_MANIFEST.name).toBe('Botiga Eco');
  });
});

describe('escapeAttribute', () => {
  it('escapes characters that could break out of a double-quoted attribute', () => {
    expect(escapeAttribute('A & B "<x>"')).toBe('A &amp; B &quot;&lt;x&gt;&quot;');
  });

  it('leaves a plain tenant name untouched', () => {
    expect(escapeAttribute('El Llevat')).toBe('El Llevat');
  });
});
