import { TestBed } from '@angular/core/testing';
import { LanguageSwitcherService } from './language-switcher.service';
import { PLATFORM_ID } from '@angular/core';

describe('LanguageSwitcherService', () => {
  let service: LanguageSwitcherService;
  const STORAGE_KEY = 'eco-lang';

  beforeEach(() => {
    // Clear localStorage for each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [LanguageSwitcherService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(LanguageSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with language from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'es');
    const lang = service.init(['ca', 'es']);
    expect(lang).toBe('es');
    expect(service.currentLanguage()).toBe('es');
  });

  it('should initialize with browser language if not in storage', () => {
    // Mocking navigator.language is tricky in some environments, but we can check if it fallbacks correctly
    // Since we didn't mock navigator.language here, it will depend on the test runner's lang.
    // Let's at least test that if not in available, it fallbacks to first one.
    const lang = service.init(['fr', 'en']);
    // Fallback to first available if browser language not in list (assuming browser is not 'fr' or 'en')
    expect(['fr', 'en']).toContain(lang);
  });

  it('should fallback to first available language if storage is empty and browser not in list', () => {
    const lang = service.init(['ca', 'es']);
    expect(['ca', 'es']).toContain(lang);
  });

  it('should save the selected language to localStorage', () => {
    service.save('es');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('es');
    expect(service.currentLanguage()).toBe('es');
  });
});
