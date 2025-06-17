import { LiveAnnouncer } from '@angular/cdk/a11y';

import { ChangeDetectionStrategy, Component, inject, DOCUMENT } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'plastik-skip-link',
  templateUrl: './skip-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLinkComponent {
  readonly #document = inject(DOCUMENT);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  readonly #router = inject(Router);

  protected skipToMainContent(event: Event): void {
    event.preventDefault();

    const urlTree = this.#router.parseUrl(this.#router.url);
    urlTree.fragment = 'mainContent';

    this.#router.navigateByUrl(urlTree).then(() => {
      const mainContent = this.#document.getElementById('mainContent');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.#liveAnnouncer.announce('Has navegat al contingut principal', 'assertive');
      }
    });
  }
}
