import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * SkipLinkComponent provides an accessible skip link for keyboard users to bypass navigation.
 */
@Component({
  selector: 'plastik-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrl: './skip-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLinkComponent {
  readonly #document = inject(DOCUMENT);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  readonly #router = inject(Router);

  /**
   * Skips focus directly to the main content area of the page.
   * @param {Event} event - The DOM click event.
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
        this.#liveAnnouncer.announce('Has navegat al contingut principal', 'assertive');
      }
    });
  }
}
