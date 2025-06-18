import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';
import { ViewsConfigRecord } from '@plastik/core/entities';
import { NasaImagesViews } from '@plastik/nasa-images/search/entities';

export const headerConfig: CoreCmsLayoutHeaderConfig = {
  showToggleMenuButton: true,
  mainIcon: { iconPath: 'assets/img/nasa.svg', svgClass: 'fill-white text-black w-[80px]' },
  title: 'NASA images',
  extendedTitle: 'NASA Images Search',
  widgetsConfig: {
    position: 'end',
    widgets: [
      {
        id: 1,
        component: () => import('@plastik/shared/button/ui').then(c => c.SharedButtonUiComponent),
        inputs: {
          config: {
            type: 'link',
            link: 'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md',
            ariaLabel: 'plastikspace -> apps -> nasa-images readme',
            dataTestId: 'github-button',
            elements: [
              {
                type: 'icon',
                content: { iconPath: 'assets/svg/github.svg', svgClass: 'w-[40px] fill-white' },
              },
            ],
            doAction: () =>
              window.open(
                'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md',
                '_blank'
              ),
          },
        },
      },
    ],
  },
};

export const viewConfig: ViewsConfigRecord<NasaImagesViews> = {
  ['search']: {
    id: 1,
    name: 'search',
    title: 'Search images',
    icon: 'image_search',
    route: ['/search'],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: { exact: false },
  },
  ['faqs']: {
    id: 2,
    name: 'faqs',
    title: 'FAQs',
    icon: 'speaker_notes',
    route: ['/faqs'],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: { exact: false },
  },
};
