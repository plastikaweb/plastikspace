import { effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ENVIRONMENT } from '@plastik/core/environments';
import { isObservable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrefixTitleService extends TitleStrategy {
  protected readonly title = inject(Title);
  protected readonly environment = inject(ENVIRONMENT);
  protected readonly translateService = inject(TranslateService, { optional: true });

  protected readonly titleSignal = signal<string | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const fullTitle = this.computeFullTitle();
      this.title.setTitle(fullTitle);
    });
  }

  /**
   * @description Update page title with the environment app name.
   * @param {RouterStateSnapshot} snapshot The state of the router at a moment in time.
   */
  updateTitle(snapshot: RouterStateSnapshot): void {
    const builtTitle: unknown = this.buildTitle(snapshot);

    if (isObservable(builtTitle)) {
      builtTitle.pipe(take(1)).subscribe(t => this.titleSignal.set(t as string | undefined));
    } else if (builtTitle instanceof Promise) {
      builtTitle.then(t => this.titleSignal.set(t as string | undefined));
    } else {
      this.titleSignal.set(builtTitle as string | undefined);
    }
  }

  /**
   * @description Compute the full title based on the current title signal.
   * @returns {string} The final title string.
   */
  protected computeFullTitle(): string {
    const translatedTitle = this.getTranslatedTitle(this.titleSignal());
    return this.getPrefixedTitle(translatedTitle);
  }

  /**
   * @description Resolve the title using TranslateService when available.
   * @param {string | undefined} title The raw route title.
   * @returns {string | undefined} The translated or original title.
   */
  protected getTranslatedTitle(title: string | undefined): string | undefined {
    if (!title) {
      return undefined;
    }
    if (!this.translateService) {
      return title;
    }
    return this.translateService.instant(title);
  }

  /**
   * @description Prefix the title with the environment application name.
   * @param {string | undefined} title The (possibly translated) title.
   * @returns {string} The final title to set in the browser.
   */
  protected getPrefixedTitle(title: string | undefined): string {
    if (!title) {
      return `${this.environment.name}`;
    }
    return `${this.environment.name} - ${title}`;
  }
}
