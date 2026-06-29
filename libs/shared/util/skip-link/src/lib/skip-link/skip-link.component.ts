import { LiveAnnouncer } from '@angular/cdk/a11y';

import { ChangeDetectionStrategy, Component, inject, DOCUMENT } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'plastik-skip-link',
  imports: [TranslatePipe],
  templateUrl: './skip-link.component.html',
  styleUrl: './skip-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLinkComponent {
  readonly #document = inject(DOCUMENT);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  readonly #router = inject(Router);
  readonly #translateService = inject(TranslateService);

  /**
   * Skips to the main content of the page.
   * @param {Event} event - The event object.
   */
  protected skipToMainContent(event: Event): void {
    event.preventDefault();

    const urlTree = this.#router.parseUrl(this.#router.url);
    urlTree.fragment = 'mainContent';

    this.#router.navigateByUrl(urlTree).then(() => {
      const mainContent = this.#document.getElementById('mainContent');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.#liveAnnouncer.announce(
          this.#translateService.instant('common.a11y.skipToContentAnnounce'),
          'assertive'
        );
      }
    });
  }
}
