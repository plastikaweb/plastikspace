import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MatThemeToggleService } from './mat-theme-toggle.service';

/**
 * Reads the color the page asks the browser bar to take.
 * @returns {string | null} The content of the `theme-color` meta, or null when the page has none.
 */
function themeColor(): string | null {
  return document.querySelector('meta[name="theme-color"]')?.getAttribute('content') ?? null;
}

describe('MatThemeToggleService', () => {
  let service: MatThemeToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MatThemeToggleService, provideZonelessChangeDetection()],
    });
    service = TestBed.inject(MatThemeToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all themes', () => {
    const themes = service.getThemes();

    expect(themes).toBeDefined();
    expect(themes.length).toBe(3);
    expect(themes).toContainEqual(expect.objectContaining({ id: 'light' }));
    expect(themes).toContainEqual(expect.objectContaining({ id: 'dark' }));
    expect(themes).toContainEqual(expect.objectContaining({ id: 'system' }));
  });

  it('should set theme', () => {
    service.setTheme('dark');
    expect(service.selectedTheme()).toEqual(expect.objectContaining({ id: 'dark' }));

    service.setTheme('light');
    expect(service.selectedTheme()).toEqual(expect.objectContaining({ id: 'light' }));
  });
});

describe('MatThemeToggleService and the browser bar', () => {
  /**
   * Builds the service the way an application does.
   * @returns {MatThemeToggleService} The service.
   */
  function setup(): MatThemeToggleService {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    });

    return TestBed.inject(MatThemeToggleService);
  }

  let pageStyles: HTMLStyleElement;

  beforeEach(() => {
    localStorage.removeItem('eco-theme');
    document.querySelector('meta[name="theme-color"]')?.remove();
    pageStyles = document.createElement('style');
    document.head.appendChild(pageStyles);
  });

  afterEach(() => {
    localStorage.removeItem('eco-theme');
    document.querySelector('meta[name="theme-color"]')?.remove();
    document.documentElement.classList.remove('light', 'dark');
    pageStyles.remove();
  });

  it('should paint the bar with the background the stylesheet gives the page in each theme', () => {
    pageStyles.textContent = `
      html.light body { background-color: rgb(170, 170, 170); }
      html.dark body { background-color: rgb(17, 17, 17); }
    `;

    const service = setup();

    service.setTheme('dark');
    TestBed.tick();

    expect(themeColor()).toBe('rgb(17, 17, 17)');

    service.setTheme('light');
    TestBed.tick();

    expect(themeColor()).toBe('rgb(170, 170, 170)');
  });

  it('should leave the bar alone when the page paints no background', () => {
    const service = setup();

    service.setTheme('dark');
    TestBed.tick();

    expect(themeColor()).toBeNull();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
