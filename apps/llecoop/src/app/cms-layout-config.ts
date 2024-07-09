import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/data-access';
import { ViewsConfigRecord } from '@plastik/core/entities';
import { LlecoopViews } from '@plastik/llecoop/entities';

export const headerConfig: CoreCmsLayoutHeaderConfig = {
  showToggleMenuButton: true,
  mainIcon: { iconPath: 'assets/img/el-llevat-logo.svg', svgClass: 'w-lg h-lg' },
  title: 'LleCOOP',
  extendedTitle: 'LleCOOP',
};

export const viewConfig: ViewsConfigRecord<LlecoopViews> = {
  ['categories']: {
    id: 1,
    name: 'categories',
    title: 'Categories',
    icon: 'image_search',
    route: [`/categories`],
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
