/* eslint-disable jsdoc/require-jsdoc */
import { inject } from '@angular/core';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';

export function headerConfig(): CoreCmsLayoutHeaderConfig {
  const firebaseAuthService = inject(FirebaseAuthService);
  return {
    showToggleMenuButton: true,
    sidenavPosition: 'start',
    mainIcon: { iconPath: 'assets/img/favicon.svg', svgClass: 'w-lg h-lg' },
    title: 'El Llevat',
    extendedTitle: 'El Llevat',
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

export function viewConfig() {
  const authFirebaseService = inject(FirebaseAuthService);
  const isAdmin = authFirebaseService.isAdmin();

  return [
    {
      id: 1,
      name: 'product',
      title: 'Productes',
      icon: 'shopping_cart',
      route: [`/admin/producte`],
      includedInNavigation: isAdmin,
      routerLinkActiveOptionsExact: false,
    },
    {
      id: 2,
      name: 'category',
      title: 'Categories',
      icon: 'category',
      route: [`/admin/categoria`],
      includedInNavigation: isAdmin,
      routerLinkActiveOptionsExact: false,
    },
    // ['tag']: {
    //   id: 2,
    //   name: 'tag',
    //   title: 'Etiquetes',
    //   icon: 'label',
    //   route: [`/tag`],
    //   includedInNavigation: true,
    //   routerLinkActiveOptionsExact: false,
    // },
    {
      id: 3,
      name: 'user',
      title: 'Usuaris',
      icon: 'person',
      route: [`/admin/usuari`],
      includedInNavigation: isAdmin,
      routerLinkActiveOptionsExact: false,
    },
    {
      id: 4,
      name: 'order-list',
      title: 'Comandes',
      icon: 'shopping_bag',
      route: [`/admin/comanda`],
      includedInNavigation: isAdmin,
      routerLinkActiveOptionsExact: false,
      divider: true,
    },
    {
      id: 5,
      name: 'order',
      title: 'Comanda activa',
      icon: 'shopping_cart',
      route: [`/soci/comanda-activa`],
      includedInNavigation: true,
      routerLinkActiveOptionsExact: false,
    },
  ].filter(view => view.includedInNavigation);
}
