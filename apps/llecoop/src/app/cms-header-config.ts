import { inject } from '@angular/core';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';

/**
 * @description Provides the configuration for the header of the CMS layout.
 * @returns {CoreCmsLayoutHeaderConfig} The header configuration object.
 */
export function HeaderConfigService(): CoreCmsLayoutHeaderConfig {
  const firebaseAuthService = inject(FirebaseAuthService);

  return {
    showToggleMenuButton: true,
    sidenavPosition: 'start',
    mainIcon: { iconPath: 'assets/img/favicon.svg', svgClass: 'w-lg h-lg' },
    title: 'El Llevat',
    extendedTitle: 'El Llevat',
    widgetsConfig: {
      position: 'end',
      widgets: [
        {
          id: 1,
          component: () =>
            import('@plastik/llecoop/order-list/order-indicator').then(
              c => c.LlecoopOrderIndicatorComponent
            ),
        },
      ],
    },
    menu: {
      label: firebaseAuthService.currentUserEmail,
      position: 'end',
      config: [
        // {
        //   id: 1,
        //   name: 'profile',
        //   title: 'Perfil',
        //   icon: 'person',
        //   route: [`/profile`],
        // },
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
