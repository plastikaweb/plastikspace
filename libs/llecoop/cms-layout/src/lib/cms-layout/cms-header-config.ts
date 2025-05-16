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
    menu: {
      label: user,
      position: 'end',
      config: [
        {
          id: 1,
          name: 'profile' as Lowercase<string>,
          title: 'Perfil',
          icon: 'person',
          route: ['/perfil'],
        },
        {
          id: 2,
          name: 'logout' as Lowercase<string>,
          title: 'Tancar sessió',
          icon: 'logout',
          action: () => firebaseAuthService.logout(),
        },
      ],
    },
  };
}
