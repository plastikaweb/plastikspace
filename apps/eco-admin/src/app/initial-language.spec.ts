import { ECO_ADMIN_LANGUAGE_STORAGE_KEY, resolveInitialLanguage } from './initial-language';

const LANGUAGES = ['ca', 'es'];

describe('resolveInitialLanguage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  /**
   * Fakes the browser language for one test.
   * @param {string} language The value `navigator.language` returns.
   */
  function setBrowserLanguage(language: string): void {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(language);
  }

  it('prefers the stored language over the browser language', () => {
    localStorage.setItem(ECO_ADMIN_LANGUAGE_STORAGE_KEY, 'es');
    setBrowserLanguage('ca-ES');

    expect(resolveInitialLanguage(LANGUAGES, 'ca')).toBe('es');
  });

  it('falls back to the browser language when nothing is stored', () => {
    setBrowserLanguage('es-ES');

    expect(resolveInitialLanguage(LANGUAGES, 'ca')).toBe('es');
  });

  it('skips a stored language the app does not ship', () => {
    localStorage.setItem(ECO_ADMIN_LANGUAGE_STORAGE_KEY, 'en');
    setBrowserLanguage('es-ES');

    expect(resolveInitialLanguage(LANGUAGES, 'ca')).toBe('es');
  });

  it('uses the default when neither the stored nor the browser language is shipped', () => {
    localStorage.setItem(ECO_ADMIN_LANGUAGE_STORAGE_KEY, 'en');
    setBrowserLanguage('fr-FR');

    expect(resolveInitialLanguage(LANGUAGES, 'ca')).toBe('ca');
  });

  it('survives a browser that blocks localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    setBrowserLanguage('es-ES');

    expect(resolveInitialLanguage(LANGUAGES, 'ca')).toBe('es');
  });
});
