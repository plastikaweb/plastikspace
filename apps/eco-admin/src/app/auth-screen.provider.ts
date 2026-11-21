import { inject, Provider, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_SCREEN_DEFAULTS, AuthScreenDefaults } from '@plastik/auth/entities';

/**
 * What every auth screen of the admin panel shows around its form. Unlike the storefront, the panel
 * has no tenant before the session opens, so the screen is always the same: the eco mark, the name of
 * the panel and one line under it. The card shakes on an error, as the storefront's does. Its fill
 * and its edge are not said here: they are CSS, shared with the storefront (`eco_auth_card`).
 * @returns {Provider} The provider of the admin panel's auth screen defaults.
 */
export function provideEcoAdminAuthScreen(): Provider {
  return {
    provide: AUTH_SCREEN_DEFAULTS,
    useFactory: (): AuthScreenDefaults => ({
      title: signal('Eco Admin'),
      subtitle: toSignal(inject(TranslateService).stream('auth.frame.subtitle'), {
        initialValue: '',
      }),
      icon: 'eco',
      cardClass: 'eco-shake-on-error',
    }),
  };
}
