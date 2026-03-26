import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageSwitcherService {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #STORAGE_KEY = 'eco-lang';

  readonly currentLanguage = signal<string | null>(null);

  init(availableLanguages: string[]): string {
    if (!isPlatformBrowser(this.#platformId)) {
      return availableLanguages[0] || '';
    }

    let lang = localStorage.getItem(this.#STORAGE_KEY);

    if (!lang) {
      const browserLang = window.navigator.language.split('-')[0];
      lang = availableLanguages.includes(browserLang) ? browserLang : null;
    }

    if (!lang || !availableLanguages.includes(lang)) {
      lang = availableLanguages[0] || '';
    }

    this.currentLanguage.set(lang);
    this.save(lang);

    return lang;
  }

  save(lang: string): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    localStorage.setItem(this.#STORAGE_KEY, lang);
    this.currentLanguage.set(lang);
  }
}
