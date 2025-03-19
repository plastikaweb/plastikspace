/* eslint-disable jsdoc/require-jsdoc */
import { computed, inject } from '@angular/core';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';

export function viewConfig() {
  const isAdmin = inject(FirebaseAuthService).isAdmin;

  return computed(() =>
    [
      {
        id: 1,
        name: 'product',
        title: 'Productes',
        icon: 'shopping_cart',
        route: [`/admin/producte`],
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 2,
        name: 'category',
        title: 'Categories',
        icon: 'category',
        route: [`/admin/categoria`],
        includedInNavigation: isAdmin(),
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
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 4,
        name: 'order-list',
        title: 'Comandes per setmana',
        icon: 'shopping_bag',
        route: [`/admin/comanda`],
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: false,
        divider: true,
      },
      {
        id: 5,
        name: 'order',
        title: 'Les meves comandes',
        icon: 'shopping_cart',
        route: [`/soci/comanda`],
        includedInNavigation: true,
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 6,
        name: 'profile',
        title: 'Perfil',
        icon: 'person',
        route: [`/soci/perfil`],
        includedInNavigation: false,
        routerLinkActiveOptionsExact: true,
      },
    ].filter(view => view.includedInNavigation)
  );
}
