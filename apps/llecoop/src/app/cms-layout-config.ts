import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';
import { ViewsConfigRecord } from '@plastik/core/entities';
import { LlecoopViews } from '@plastik/llecoop/entities';

export const headerConfig: CoreCmsLayoutHeaderConfig = {
  showToggleMenuButton: true,
  mainIcon: { iconPath: 'assets/img/favicon.svg', svgClass: 'w-lg h-lg' },
  title: 'El Llevat',
  extendedTitle: 'El Llevat',
  menu: {
    position: 'end',
    config: [
      {
        id: 1,
        name: 'profile',
        title: 'Perfil',
        icon: 'person',
        route: [`/profile`],
      },
      {
        id: 2,
        name: 'logout',
        title: 'Tancar sessió',
        icon: 'logout',
        // eslint-disable-next-line no-console
        action: () => console.log('logout'),
      },
    ],
  },
};

export const viewConfig: ViewsConfigRecord<LlecoopViews> = {
  ['product']: {
    id: 3,
    name: 'product',
    title: 'Productes',
    icon: 'shopping_cart',
    route: [`/product`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
  ['category']: {
    id: 1,
    name: 'category',
    title: 'Categories',
    icon: 'category',
    route: [`/category`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
  ['tag']: {
    id: 2,
    name: 'tag',
    title: 'Etiquetes',
    icon: 'label',
    route: [`/tag`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
  ['user']: {
    id: 4,
    name: 'user',
    title: 'Usuaris',
    icon: 'person',
    route: [`/user`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
  ['order']: {
    id: 5,
    name: 'order',
    title: 'Comandes',
    icon: 'shopping_bag',
    route: [`/order`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
};
