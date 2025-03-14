import { inject } from '@angular/core';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';

/**
 * @description Provides the configuration for the header of the CMS layout.
 * @returns {CoreCmsLayoutHeaderConfig} The header configuration object.
 */
export function HeaderConfigService(): CoreCmsLayoutHeaderConfig {
  const firebaseAuthService = inject(FirebaseAuthService);
  const user = inject(llecoopUserStore).getUserName;

  return {
    showToggleMenuButton: true,
    sidenavPosition: 'start',
    mainIcon: { iconPath: 'assets/img/favicon.svg', svgClass: 'size-lg' },
    title: '',
    extendedTitle: 'El Llevat',
    widgetsConfig: {
      position: 'end',
      widgets: [
        {
          id: 'order-indicator',
          component: () =>
            import('@plastik/llecoop/order-list/order-indicator').then(
              c => c.LlecoopOrderIndicatorComponent
            ),
          order: 1,
        },
        {
          id: 'theme-toggle',
          component: () =>
            import('@plastik/shared/mat-theme-toggle').then(c => c.MatThemeToggleComponent),
          order: 2,
        },
      ],
    },
    menu: {
      label: user,
      position: 'end',
      config: [
        {
          id: 1,
          name: 'profile',
          title: 'Perfil',
          icon: 'person',
          route: [`/soci/perfil`],
        },
        {
          id: 2,
          name: 'logout',
          title: 'Tancar sessió',
          icon: 'logout',
          action: () => firebaseAuthService.logout(),
        },
      ],
    },
  };
}
