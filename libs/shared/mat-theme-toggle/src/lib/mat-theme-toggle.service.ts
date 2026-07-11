import { LiveAnnouncer } from '@angular/cdk/a11y';

import { computed, DOCUMENT, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { MAT_THEME_COLORS, THEMES, MatThemeToggleConfig } from './mat-theme';

@Injectable({
  providedIn: 'root',
})
export class MatThemeToggleService implements OnDestroy {
  readonly #document = inject(DOCUMENT);
  readonly #translateService = inject(TranslateService);
  readonly #meta = inject(Meta);
  readonly #theme = signal<keyof typeof THEMES>(this.#getThemeFromLocalStorage() || 'system');
  readonly selectedTheme = computed(() => THEMES[this.#theme()]);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  readonly #themeColors = inject(MAT_THEME_COLORS);
  readonly #query = window.matchMedia('(prefers-color-scheme: dark)');

  readonly #setSystemTheme = effect(() => {
    const currentTheme = this.#theme();
    const htmlClassList = this.#document.documentElement.classList;

    htmlClassList.remove('light', 'dark');

    if (currentTheme !== 'system') {
      htmlClassList.add(currentTheme);
    }

    this.#updateThemeColorMeta();
  });

  constructor() {
    this.#query.addEventListener('change', this.#onSystemThemeChange);
  }

  ngOnDestroy(): void {
    this.#query.removeEventListener('change', this.#onSystemThemeChange);
  }

  getThemes(): MatThemeToggleConfig[] {
    return Object.values(THEMES);
  }

  setTheme(theme: keyof typeof THEMES): void {
    this.#theme.set(theme);
    this.#setThemeToLocalStorage(theme);

    const translatedThemeName = this.#translateService.instant(THEMES[theme].name);
    const message = this.#translateService.instant('common.theme.changedTo', {
      theme: translatedThemeName,
    });

    this.#liveAnnouncer.announce(message, 'assertive', 100);
  }

  readonly #onSystemThemeChange = (): void => {
    if (this.#theme() === 'system') {
      // Re-trigger the effect to ensure classes are clean,
      // although light-dark() CSS handles the actual visual change.
      this.#theme.set('system');
    }
  };

  #updateThemeColorMeta(): void {
    const currentTheme = this.#theme();
    let color = this.#themeColors.light; // Default light surface

    if (currentTheme === 'dark' || (currentTheme === 'system' && this.#query.matches)) {
      color = this.#themeColors.dark; // Dark surface
    }

    this.#meta.updateTag({ name: 'theme-color', content: color });
  }

  #setThemeToLocalStorage(theme: keyof typeof THEMES): void {
    localStorage.setItem('eco-theme', theme);
  }

  #getThemeFromLocalStorage(): keyof typeof THEMES {
    return localStorage.getItem('eco-theme') as keyof typeof THEMES;
  }
}
