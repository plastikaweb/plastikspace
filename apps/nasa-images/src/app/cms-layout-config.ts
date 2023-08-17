import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/data-access';
import { ViewsConfigRecord } from '@plastik/core/entities';
import { NasaImagesViews } from '@plastik/nasa-images/search/entities';

export const headerConfig: CoreCmsLayoutHeaderConfig = {
  showToggleMenuButton: true,
  mainIcon: { iconPath: 'assets/img/nasa.svg', svgClass: 'fill-white text-black w-[80px]' },
  title: 'NASA images',
  extendedTitle: 'NASA Images Search',
  socialLinks: {
    position: 'end',
    config: [
      {
        id: 1,
        type: 'link',
        elements: [{ type: 'icon', content: { iconPath: 'assets/svg/github.svg', svgClass: 'w-[40px] fill-white' } }],
        ariaLabel: 'plastikspace -> apps -> nasa-images readme',
        dataTestId: 'github-button',
        link: 'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md',
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
    route: [`/search`],
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
