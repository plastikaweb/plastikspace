import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreTenant, EcoStoreTenantWindowStatus } from '@plastik/eco-store/entities';
import { StoreWindowComponent } from '@plastik/eco-store/store-window';
import { map } from 'rxjs';
// import { SharedFormFeatureComponent } from '@plastik/shared/form';
import { MatThemeToggleComponent } from '@plastik/shared/mat-theme-toggle';
import { LanguageSwitcherComponent, LanguageSwitcherService } from '@plastik/shared/translation';
import { EcoTenantLinkComponent } from '../tenant-link/tenant-link.component';

@Component({
  selector: 'eco-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButtonModule,
    TranslateModule,
    // SharedFormFeatureComponent,
    StoreWindowComponent,
    EcoTenantLinkComponent,
    MatThemeToggleComponent,
    LanguageSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'slide-in',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoHeaderComponent {
  readonly formConfig = input<FormConfig<{ query: string }>>();
  readonly tenant = input<EcoStoreTenant | null>();
  readonly storeStatus = input<EcoStoreTenantWindowStatus | undefined>();
  readonly nextOpenDate = input<Date | null | undefined>();
  readonly countdownSegments = input<string[]>([]);
  readonly is24h = input<boolean | undefined>();
  readonly closedReason = input<string | null | undefined>();
  readonly sideNavOpen = input<boolean>();
  readonly isMobile = input<boolean>();
  readonly hasSidenav = input<boolean>();
  readonly isTrial = input<boolean>(false);
  readonly trialDaysLeft = input<number>(0);
  readonly isTrialExpired = input<boolean>(false);
  readonly submitEvent = output<{ query: string }>();
  readonly toggleSidenav = output<void>();

  readonly #translateService = inject(TranslateService);
  readonly #languageSwitcherService = inject(LanguageSwitcherService);
  protected readonly currentLang = toSignal(
    this.#translateService.onLangChange.pipe(map(event => event.lang)),
    {
      initialValue: this.#translateService.getCurrentLang() || '',
    }
  );

  constructor() {
    effect(() => {
      const tenant = this.tenant();
      if (tenant) {
        const lang = this.#languageSwitcherService.init(tenant.languages);
        this.#translateService.use(lang);
      }
    });
  }

  onLanguageChange(lang: string): void {
    this.#translateService.use(lang);
    this.#languageSwitcherService.save(lang);
  }
}
