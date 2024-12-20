import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { ENVIRONMENT } from '@plastik/core/environments';

@Injectable({
  providedIn: 'root',
})
export class PrefixTitleService extends TitleStrategy {
  readonly #title = inject(Title);
  readonly #environment = inject(ENVIRONMENT);

  /**
   * @description Update page title with the environment app name.
   * @param {RouterStateSnapshot} snapshot The state of the router at a moment in time.
   */
  updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    this.#title.setTitle(
      !title ? `${this.#environment.name}` : `${this.#environment.name} - ${title}`
    );
  }
}
