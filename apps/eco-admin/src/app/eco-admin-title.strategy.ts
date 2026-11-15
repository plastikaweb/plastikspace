import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * The product name shown in the browser tab. It is a brand name, so it is not translated.
 */
export const ECO_ADMIN_APP_NAME = 'Eco Admin';

/**
 * Sets the document title to "{translated route title} · Eco Admin".
 *
 * A route's `title` is a translation key. The title is written again when the interface language
 * changes, so the tab never keeps the previous language.
 */
@Injectable({ providedIn: 'root' })
export class EcoAdminTitleStrategy extends TitleStrategy {
  readonly #title = inject(Title);
  readonly #translate = inject(TranslateService);

  #titleKey: string | undefined;

  constructor() {
    super();

    this.#translate.onLangChange.pipe(takeUntilDestroyed()).subscribe(() => this.#apply());
  }

  /**
   * Stores the title key of the activated route and writes the document title.
   * @param {RouterStateSnapshot} snapshot The router state the navigation ended in.
   */
  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.#titleKey = this.buildTitle(snapshot);
    this.#apply();
  }

  /**
   * Writes the document title from the stored key and the current language.
   */
  #apply(): void {
    const translated = this.#titleKey ? this.#translate.instant(this.#titleKey) : '';

    this.#title.setTitle(
      typeof translated === 'string' && translated
        ? `${translated} · ${ECO_ADMIN_APP_NAME}`
        : ECO_ADMIN_APP_NAME
    );
  }
}
