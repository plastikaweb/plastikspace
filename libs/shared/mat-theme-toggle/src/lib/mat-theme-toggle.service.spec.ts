import { TestBed } from '@angular/core/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

import { MatThemeToggleService } from './mat-theme-toggle.service';

describe('MatThemeToggleService', () => {
  let service: MatThemeToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatThemeToggleService, provideExperimentalZonelessChangeDetection()],
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
