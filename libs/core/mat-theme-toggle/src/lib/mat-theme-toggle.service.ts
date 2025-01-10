import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

const THEMES = {
  light: {
    id: 'light',
    name: 'clar' as const,
    icon: 'light_mode' as const,
  },
  dark: {
    id: 'dark',
    name: 'fosc' as const,
    icon: 'dark_mode' as const,
  },
  system: {
    id: 'system',
    name: 'sistema' as const,
    icon: 'desktop_mac' as const,
  },
} as const;

export type MatThemeConfig = (typeof THEMES)[keyof typeof THEMES];

@Injectable()
export class MatThemeToggleService {
  readonly #document = inject(DOCUMENT);
  readonly #theme = signal<keyof typeof THEMES>(this.#getThemeFromLocalStorage() || 'system');
  readonly selectedTheme = computed(() => THEMES[this.#theme()]);

  readonly #setSystemTheme = effect(() => {
    const scheme = this.#theme() === 'system' ? 'light dark' : this.#theme();
    this.#document.body.style.colorScheme = scheme;
  });

  getThemes(): MatThemeConfig[] {
    return Object.values(THEMES);
  }

  setTheme(theme: keyof typeof THEMES): void {
    this.#theme.set(theme);
    this.#setThemeToLocalStorage(theme);
  }

  #setThemeToLocalStorage(theme: keyof typeof THEMES): void {
    localStorage.setItem('llecoop-theme', theme);
  }

  #getThemeFromLocalStorage(): keyof typeof THEMES {
    return localStorage.getItem('llecoop-theme') as keyof typeof THEMES;
  }
}
