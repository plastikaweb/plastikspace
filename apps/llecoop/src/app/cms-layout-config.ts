/* eslint-disable jsdoc/require-jsdoc */
import { computed, inject, Signal } from '@angular/core';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { ViewConfig } from '@plastik/core/entities';
import { LlecoopViews } from '@plastik/llecoop/entities';

export function viewConfig(): Signal<ViewConfig<LlecoopViews>[]> {
  const firebaseAuthService = inject(FirebaseAuthService);

  return computed(() => {
    return [
      {
        id: 1,
        name: 'product',
        title: 'Productes',
        icon: 'eco',
        route: ['/productes'],
        includedInNavigation: firebaseAuthService.isAdmin(),
        routerLinkActiveOptionsExact: { exact: false },
      },
      {
        id: 2,
        name: 'category',
        title: 'Categories',
        icon: 'category',
        route: ['/categories'],
        includedInNavigation: firebaseAuthService.isAdmin(),
        routerLinkActiveOptionsExact: { exact: false },
      },
      // ['tag']: {
      //   id: 2,
      //   name: 'tag',
      //   title: 'Etiquetes',
      //   icon: 'label',
      //   route: ['/tag'],
      //   includedInNavigation: true,
      //   routerLinkActiveOptionsExact: false,
      // },
      {
        id: 3,
        name: 'user',
        title: 'Usuaris',
        icon: 'mood',
        route: ['/usuaris'],
        includedInNavigation: firebaseAuthService.isAdmin(),
        routerLinkActiveOptionsExact: { exact: false },
      },
      {
        id: 4,
        name: 'order',
        title: 'Comandes',
        icon: 'shopping_cart',
        route: ['/comandes'],
        includedInNavigation: true,
        routerLinkActiveOptionsExact: { exact: false },
        children: [
          {
            id: 6,
            name: 'order-list',
            title: 'per setmana',
            icon: 'shopping_basket',
            route: ['/comandes/setmanals'],
            includedInNavigation: firebaseAuthService.isAdmin(),
            routerLinkActiveOptionsExact: { exact: false },
          },
          {
            id: 7,
            name: 'all-order',
            title: 'totes',
            icon: 'shopping_bag',
            route: ['/comandes/totes'],
            includedInNavigation: firebaseAuthService.isAdmin(),
            routerLinkActiveOptionsExact: { exact: false },
            divider: true,
          },
          {
            id: 8,
            name: 'my-order',
            title: 'les meves',
            icon: 'face_2',
            route: ['/comandes'],
            includedInNavigation: true,
            routerLinkActiveOptionsExact: {
              paths: 'exact',
              queryParams: 'ignored',
              fragment: 'ignored',
              matrixParams: 'ignored',
            },
          },
        ],
      },
      {
        id: 5,
        name: 'profile',
        title: 'Perfil',
        icon: 'person',
        route: ['/perfil'],
        includedInNavigation: false,
        routerLinkActiveOptionsExact: { exact: true },
      },
    ].filter(view => view.includedInNavigation) as ViewConfig<LlecoopViews>[];
  });
}
