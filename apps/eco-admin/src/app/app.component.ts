import { FocusMonitor } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { SharedNotificationUiHotToastComponent } from '@plastik/shared/notification/ui/hot-toast';
import { SkipLinkComponent } from '@plastik/shared/skip-link';

/**
 * The class `core_a11y` reads to draw the single keyboard focus ring.
 */
const KEYBOARD_ACTIVE_CLASS = 'is-keyboard-active';

@Component({
  imports: [RouterOutlet, SharedNotificationUiHotToastComponent, SkipLinkComponent],
  selector: 'eco-admin-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-dvh',
  },
})
export class AppComponent {
  protected readonly notificationStore = inject(notificationStore);

  readonly #document = inject(DOCUMENT);
  readonly #environment = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);
  readonly #focusMonitor = inject(FocusMonitor);
  readonly #renderer = inject(Renderer2);
  readonly #translate = inject(TranslateService);

  constructor() {
    this.#translate.addLangs(this.#environment.languages);

    // `core_a11y` hides every native outline and draws one ring on the focused element, but only
    // while the body carries this class. Without the wiring a keyboard user sees no focus at all.
    this.#focusMonitor
      .monitor(this.#document.body, true)
      .pipe(takeUntilDestroyed())
      .subscribe(origin => {
        if (origin === 'keyboard') {
          this.#renderer.addClass(this.#document.body, KEYBOARD_ACTIVE_CLASS);
        } else {
          this.#renderer.removeClass(this.#document.body, KEYBOARD_ACTIVE_CLASS);
        }
      });
  }
}
