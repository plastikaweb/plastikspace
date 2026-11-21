import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_FORM_FACADE, AUTH_SCREEN_DEFAULTS, AuthFormMessage } from '@plastik/auth/entities';
import { AlertType } from '@plastik/core/entities';
import { SharedAlertUiComponent } from '@plastik/shared/alert/ui';
import { SharedFormFeatureComponent } from '@plastik/shared/form';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { MatThemeToggleComponent } from '@plastik/shared/mat-theme-toggle';

/**
 * The look of the card. It lives here, and not in the template, because the card also takes the
 * classes of the application and a template cannot carry `class` and `[class]` on one element.
 * An application that wants another fill or an edge says so in its own stylesheet, on
 * `plastik-auth-feature .mat-mdc-card`.
 */
const CARD_CLASSES =
  'bg-surface-container-low/80 w-full max-w-[450px] overflow-hidden border-none! shadow-2xl! backdrop-blur-xl';

/**
 * @description The screen every auth view of an application is drawn in: the mark and the name of
 * the application over a Material card, the heading of the view, what the last attempt ended in,
 * the form, and the theme control.
 *
 * A view projects its parts into `[title]`, `[description]` and `[content]`, and hands the end of
 * its flow, when it has one, to `outcome`. What surrounds them
 * comes from the `AUTH_SCREEN_DEFAULTS` the application provides once. The four inputs of the mark
 * (`title`, `logo`, `name`, `nameLink`) are for an application that mounts the screen straight on
 * a route and names itself in the data of that route.
 */
@Component({
  selector: 'plastik-auth-feature',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    TranslatePipe,
    MatThemeToggleComponent,
    SharedAlertUiComponent,
    SharedFormFeatureComponent,
    SharedImgContainerComponent,
  ],
  templateUrl: './auth-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFeatureComponent {
  /**
   * @description The name over the card. Unset, the one of `AUTH_SCREEN_DEFAULTS`.
   */
  readonly title = input<string>();

  /**
   * @description The image of the mark, as the image loader of the application takes it.
   * Unset, the one of `AUTH_SCREEN_DEFAULTS`; with none at all, the icon of the defaults is drawn.
   */
  readonly logo = input<string | null>();

  /**
   * @description Whether an attempt is running: the card is dimmed and takes no pointer.
   */
  readonly isLoading = input<boolean>(false);

  /**
   * @description Why the last attempt failed. Shown over the form, and given the focus when it appears.
   */
  readonly error = input<AuthFormMessage | null>(null);

  /**
   * @description How the last attempt ended well. Shown over the form while there is no `error`.
   */
  readonly success = input<AuthFormMessage | null>(null);

  /**
   * @description Where the flow of the view ended (a password that was changed, a link that no
   * longer works). Set, it is drawn in place of the heading, the description and the notice of the
   * view, as a heading, a sentence and one filled link, and it takes the focus when it appears.
   * What the view projects into `[content]` is still drawn under it.
   */
  readonly outcome = input<AuthFormMessage | null>(null);

  /**
   * @description Who signs the foot of the card, followed by the year, when the defaults give no foot.
   */
  readonly name = input<string>();

  /**
   * @description Where the name at the foot of the card links to.
   */
  readonly nameLink = input<string>();

  protected readonly facade = inject(AUTH_FORM_FACADE, { optional: true });
  protected readonly currentYear = new Date().getFullYear();
  protected readonly messageAlert = viewChild('messageAlert', { read: ElementRef });
  protected readonly outcomePanel = viewChild('outcomePanel', { read: ElementRef });

  readonly #defaults = inject(AUTH_SCREEN_DEFAULTS, { optional: true });

  protected readonly brandTitle = computed(() => this.title() ?? this.#defaults?.title?.() ?? '');
  protected readonly brandSubtitle = computed(() => this.#defaults?.subtitle?.() ?? '');
  protected readonly brandImage = computed(() => this.logo() ?? this.#defaults?.logo?.() ?? null);
  protected readonly brandIcon = this.#defaults?.icon ?? 'lock';
  protected readonly cardFooter = computed(() => this.#defaults?.footer?.() ?? '');
  protected readonly cardClasses = `${CARD_CLASSES} ${this.#defaults?.cardClass ?? ''}`.trim();
  protected readonly canGoBack = computed(() => this.#defaults?.canGoBack?.() ?? false);

  /**
   * The notice over the form: the failure if there is one, else the good end, each with its kind.
   */
  protected readonly message = computed(() => {
    const error = this.error();
    const notice = error ?? this.success();
    const fallbackType: AlertType = error ? 'ERROR' : 'SUCCESS';

    return notice ? { ...notice, type: notice.type ?? fallbackType } : null;
  });

  constructor() {
    // A failure moves the focus to its notice, so that it is read and the keyboard goes on from it.
    // The notice is drawn again for every failed attempt, which is also what shakes the card again.
    effect(() => {
      const alert = this.messageAlert();

      if (alert && untracked(this.error)) {
        alert.nativeElement.focus();
      }
    });

    // The end of a flow takes the form away, and with it the button the focus was on. The panel that
    // stands in its place takes the focus, which is also what has it read: it is named by its heading.
    effect(() => this.outcomePanel()?.nativeElement.focus());

    // The facade can outlive the screen, so the reason of a failed attempt goes away with the visit
    // that got it: the next one must not open on it.
    inject(DestroyRef).onDestroy(() => this.facade?.clearError?.());
  }

  /**
   * @description Takes the way back the application provides.
   */
  protected goBack(): void {
    this.#defaults?.goBack?.();
  }
}
