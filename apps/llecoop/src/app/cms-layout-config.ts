import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/data-access';
import { ViewsConfigRecord } from '@plastik/core/entities';
import { LlecoopViews } from '@plastik/llecoop/entities';

export const headerConfig: CoreCmsLayoutHeaderConfig = {
  showToggleMenuButton: true,
  mainIcon: { iconPath: 'assets/img/el-llevat-logo.svg', svgClass: 'w-lg h-lg' },
  title: 'El Llevat',
  extendedTitle: 'El Llevat',
};

export const viewConfig: ViewsConfigRecord<LlecoopViews> = {
  ['category']: {
    id: 1,
    name: 'category',
    title: 'Categories',
    icon: 'image_search',
    route: [`/category`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
  ['faqs']: {
    id: 2,
    name: 'faqs',
    title: 'FAQs',
    icon: 'speaker_notes',
    route: [`/faqs`],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: false,
  },
};
