import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ENVIRONMENT } from '@plastik/core/environments';

@Injectable({
  providedIn: 'root',
})
export class PrefixTitleService extends TitleStrategy {
  readonly #title = inject(Title);
  readonly #environment = inject(ENVIRONMENT);
  readonly #translateService = inject(TranslateService, { optional: true });

  /**
   * @description Update page title with the environment app name.
   * @param {RouterStateSnapshot} snapshot The state of the router at a moment in time.
   */
  updateTitle(snapshot: RouterStateSnapshot): void {
    const builtTitle = this.buildTitle(snapshot);
    const translatedTitle = this.#getTranslatedTitle(builtTitle);
    const fullTitle = this.#getPrefixedTitle(translatedTitle);
    this.#title.setTitle(fullTitle);
  }

  /**
   * @description Resolve the title using TranslateService when available.
   * @param {string | undefined} title The raw route title.
   * @returns {string | undefined} The translated or original title.
   */
  #getTranslatedTitle(title: string | undefined): string | undefined {
    if (!title) {
      return undefined;
    }
    if (!this.#translateService) {
      return title;
    }
    return this.#translateService.instant(title);
  }

  /**
   * @description Prefix the title with the environment application name.
   * @param {string | undefined} title The (possibly translated) title.
   * @returns {string} The final title to set in the browser.
   */
  #getPrefixedTitle(title: string | undefined): string {
    if (!title) {
      return `${this.#environment.name}`;
    }
    return `${this.#environment.name} - ${title}`;
  }
}
