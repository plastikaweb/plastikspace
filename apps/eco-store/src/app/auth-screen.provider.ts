import { computed, inject, Provider } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_SCREEN_DEFAULTS, AuthScreenDefaults } from '@plastik/auth/entities';
import { NavigationService } from '@plastik/core/router-state';
import { getPocketBaseImageUrl, PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

/**
 * What every auth screen of the storefront shows around its form. That is the tenant's name, slogan
 * and logo, with the eco ones while the tenant has none, the terms line at the foot of the card, the
 * shake of the card on an error and, in the installed application, the way back to the store.
 * @returns {Provider} The provider of the storefront's auth screen defaults.
 */
export function provideEcoStoreAuthScreen(): Provider {
  return {
    provide: AUTH_SCREEN_DEFAULTS,
    useFactory: (): AuthScreenDefaults => {
      const translate = inject(TranslateService);
      const navigationService = inject(NavigationService);
      const { tenant } = inject(ecoStoreTenantStore);
      const fallbackTitle = toSignal(translate.stream('auth.common.title'), { initialValue: '' });
      const fallbackSlogan = toSignal(translate.stream('auth.common.slogan'), { initialValue: '' });

      return {
        title: computed(() => tenant()?.shortName || tenant()?.name || fallbackTitle()),
        subtitle: computed(() => tenant()?.slogan || fallbackSlogan()),
        logo: computed(() => getPocketBaseImageUrl(tenant(), tenant()?.logo)),
        icon: 'eco_logo',
        footer: toSignal(translate.stream('auth.common.termsPrivacy'), { initialValue: '' }),
        cardClass: 'eco-shake-on-error',
        canGoBack: inject(PwaNavigationService).isStandalone,
        goBack: () => navigationService.back('/botiga'),
      };
    },
  };
}
