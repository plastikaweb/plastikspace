import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ecoAdminHomeFor, resolveReturnUrl } from '@plastik/eco-admin/auth/data-access';
import { MatThemeToggleService } from '@plastik/shared/mat-theme-toggle';

import { EcoAdminAuthLoginFacade } from './eco-admin-auth-login.facade';

/**
 * The login screen of eco-admin: address and password, for administrators only.
 */
@Component({
  selector: 'eco-admin-auth-login',
  imports: [ReactiveFormsModule, MatIcon, TranslatePipe],
  templateUrl: './eco-admin-auth-login.component.html',
  styleUrl: './eco-admin-auth-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EcoAdminAuthLoginFacade],
})
export class EcoAdminAuthLoginComponent {
  /**
   * Where the visitor was heading when they were sent here. Bound from the `returnUrl` query parameter.
   */
  readonly returnUrl = input<string>();

  protected readonly appName = 'Eco Admin';
  protected readonly facade = inject(EcoAdminAuthLoginFacade);
  protected readonly form = inject(NonNullableFormBuilder).group({ email: '', password: '' });
  protected readonly isPasswordVisible = signal(false);
  protected readonly isSubmitting = computed(() => this.facade.status() === 'submitting');
  // Angular cannot resolve a view query declared on an ES private field.
  protected readonly errorBlock = viewChild<ElementRef<HTMLElement>>('errorBlock');
  protected readonly isDark = computed(() => {
    const theme = this.#themeService.selectedTheme().id;

    return theme === 'dark' || (theme === 'system' && this.#prefersDark());
  });

  readonly #router = inject(Router);
  readonly #injector = inject(Injector);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  readonly #translate = inject(TranslateService);
  readonly #themeService = inject(MatThemeToggleService);
  readonly #systemTheme = inject(DOCUMENT).defaultView?.matchMedia?.(
    '(prefers-color-scheme: dark)'
  );
  readonly #prefersDark = signal(this.#systemTheme?.matches ?? false);

  constructor() {
    const onSystemThemeChange = (event: MediaQueryListEvent): void =>
      this.#prefersDark.set(event.matches);

    this.#systemTheme?.addEventListener('change', onSystemThemeChange);
    inject(DestroyRef).onDestroy(() =>
      this.#systemTheme?.removeEventListener('change', onSystemThemeChange)
    );
  }

  protected async submit(): Promise<void> {
    const result = await this.facade.submit(this.form.getRawValue());

    if (result === 'rejected') {
      // The block exists only after the next render; it takes the focus so the reason is read at once.
      afterNextRender(
        { read: () => this.errorBlock()?.nativeElement.focus() },
        { injector: this.#injector }
      );

      return;
    }

    const role = this.facade.role();

    if (result !== 'authenticated' || !role) {
      return;
    }

    // The screen is destroyed by the navigation below, so a live region in it would be cut short.
    // The announcer lives in the document and outlasts the route.
    const redirect = role === 'GLOBAL_ADMIN' ? 'redirectGlobal' : 'redirectTenant';

    void this.#liveAnnouncer.announce(
      `${this.#translate.instant('auth.login.success.title')} ${this.#translate.instant(`auth.login.success.${redirect}`)}`,
      'polite'
    );
    await this.#router.navigateByUrl(resolveReturnUrl(this.returnUrl(), ecoAdminHomeFor(role)));
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update(isVisible => !isVisible);
  }

  protected toggleTheme(): void {
    this.#themeService.setTheme(this.isDark() ? 'light' : 'dark');
  }
}
