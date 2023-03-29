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
        type: 'link',
        elements: [{ iconPath: 'assets/svg/github.svg', svgClass: 'w-[40px] fill-white' }],
        ariaLabel: 'plastikspace -> apps -> nasa-images readme',
        link: 'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md',
      },
    ],
  },
};

export const viewConfig: ViewsConfigRecord<NasaImagesViews> = {
  [NasaImagesViews.SEARCH]: {
    name: NasaImagesViews.SEARCH,
    title: 'Search images',
    icon: 'image_search',
    route: [`/${NasaImagesViews.SEARCH}`],
    includedInNavigation: true,
  },
  [NasaImagesViews.FAQS]: {
    name: NasaImagesViews.FAQS,
    title: 'FAQs',
    icon: 'speaker_notes',
    route: [`/${NasaImagesViews.FAQS}`],
    includedInNavigation: true,
  },
};
