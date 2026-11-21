import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { ECO_ADMIN_LOGIN_URL } from '@plastik/eco-admin/auth/data-access';
import { EcoAdminNavVariant } from '@plastik/eco-admin/layout-config';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { MatThemeToggleComponent } from '@plastik/shared/mat-theme-toggle';
import { LanguageSwitcherComponent, LanguageSwitcherService } from '@plastik/shared/translation';
import { map } from 'rxjs';

/**
 * The top bar of the frozen `00 Components/Top bar` (round 40.18): the «menu» button, the title of the
 * view, then the language, the theme and the account. The store chip waits for row 0.6d, which
 * promotes it from the storefront; the crumb and the way back wait for the first detail view.
 */
@Component({
  selector: 'eco-admin-top-bar',
  imports: [
    LanguageSwitcherComponent,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatThemeToggleComponent,
    TranslatePipe,
  ],
  templateUrl: './eco-admin-top-bar.component.html',
  styleUrl: './eco-admin-top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoAdminTopBarComponent {
  /** The i18n key of the view's title: the label of its rail entry. */
  readonly titleKey = input('');

  /** The tenant's bar, or the platform's: its account menu names the tenant or not. */
  readonly variant = input<EcoAdminNavVariant>('tenant');

  readonly #profile = inject(pocketBaseUserProfileStore);
  readonly #tenantContext = inject(ecoAdminTenantContextStore);
  readonly #router = inject(Router);
  readonly #translate = inject(TranslateService);
  readonly #languageSwitcher = inject(LanguageSwitcherService);

  /** The languages the panel ships, from the environment. */
  protected readonly languages = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT).languages;

  protected readonly currentLanguage = toSignal(
    this.#translate.onLangChange.pipe(map(event => event.lang)),
    { initialValue: this.#translate.getCurrentLang() || '' }
  );

  protected readonly userName = computed(() => this.#profile.user()?.name?.trim() ?? '');

  /** Two letters, as the mock draws them; dots while the name is unknown. */
  protected readonly initials = computed(() => {
    const letters = this.userName()
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return letters || '··';
  });

  /** The tenant a tenant administrator runs; empty for the platform. */
  protected readonly tenantName = this.#tenantContext.tenantName;

  protected readonly roleKey = computed(() =>
    this.variant() === 'platform'
      ? 'shell.account.role.GLOBAL_ADMIN'
      : 'shell.account.role.TENANT_ADMIN'
  );

  /**
   * Switches the interface language and remembers it, in this browser and on the user.
   * The user's copy is `users.language`, which the PocketBase mail hooks read to write to this
   * administrator. Unlike the storefront, the panel writes it only on an explicit change, not after
   * every login.
   * @param {string} language The language picked.
   */
  protected onLanguageChange(language: string): void {
    this.#translate.use(language);
    this.#languageSwitcher.save(language);
    void this.#profile.updateLanguage(language);
  }

  /** Closes the session and goes back to the login screen. */
  protected logout(): void {
    this.#profile.logout();
    void this.#router.navigateByUrl(ECO_ADMIN_LOGIN_URL);
  }
}
