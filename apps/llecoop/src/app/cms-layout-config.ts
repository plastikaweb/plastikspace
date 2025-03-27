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
        route: [`/admin/productes`],
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 2,
        name: 'category',
        title: 'Categories',
        icon: 'category',
        route: [`/admin/categories`],
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
        route: [`/admin/usuaris`],
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 4,
        name: 'order-list',
        title: 'Comandes setmanals',
        icon: 'shopping_basket',
        route: [`/admin/comandes-setmanals`],
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 5,
        name: 'order-list-users',
        title: 'Totes les comandes',
        icon: 'shopping_bag',
        route: [`/admin/comandes`],
        includedInNavigation: isAdmin(),
        routerLinkActiveOptionsExact: true,
        divider: true,
      },
      {
        id: 6,
        name: 'order',
        title: 'Les meves comandes',
        icon: 'shopping_cart',
        route: [`/comandes`],
        includedInNavigation: true,
        routerLinkActiveOptionsExact: false,
      },
      {
        id: 7,
        name: 'profile',
        title: 'Perfil',
        icon: 'person',
        route: [`/perfil`],
        includedInNavigation: false,
        routerLinkActiveOptionsExact: true,
      },
    ].filter(view => view.includedInNavigation)
  );
}
