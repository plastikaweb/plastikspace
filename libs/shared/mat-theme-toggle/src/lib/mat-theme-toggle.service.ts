import { LiveAnnouncer } from '@angular/cdk/a11y';

import { computed, DOCUMENT, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { THEMES, MatThemeToggleConfig } from './mat-theme';

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
  readonly #query = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Puts the chosen theme on <html> and the browser bar, now and on every change. Created here
    // rather than kept in a field, which nothing would read.
    effect(() => {
      const currentTheme = this.#theme();
      const htmlClassList = this.#document.documentElement.classList;

      htmlClassList.remove('light', 'dark');

      if (currentTheme !== 'system') {
        htmlClassList.add(currentTheme);
      }

      this.#updateThemeColorMeta();
    });
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
    // With the system theme `light-dark()` has already repainted the page: only the browser bar is
    // left to follow. Setting the signal to the value it holds would notify nobody.
    if (this.#theme() === 'system') {
      this.#updateThemeColorMeta();
    }
  };

  /**
   * Paints the browser bar (`<meta name="theme-color">`) with the color the stylesheet gives the page.
   * The color is read from the `background-color` of `<body>` once the theme is applied, so it comes
   * from the palette of the application and follows whatever the stylesheet reacts to.
   */
  #updateThemeColorMeta(): void {
    const body = this.#document.body;
    const color = this.#document.defaultView?.getComputedStyle(body).backgroundColor;

    // A page that paints no background of its own keeps the bar as its `index.html` left it.
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      return;
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
