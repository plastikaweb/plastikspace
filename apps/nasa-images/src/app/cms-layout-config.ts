import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/data-access';
import { ViewsConfigRecord } from '@plastik/core/entities';

export enum NasaImagesViews {
  SEARCH = 'search',
  EXPLANATION = 'explanation',
}

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
        link: 'https://github.com/plastikaweb/plastikspace/tree/main/apps/nasa-images/README.md',
      },
    ],
  },
};

export const viewConfig: ViewsConfigRecord<NasaImagesViews> = {
  [NasaImagesViews.SEARCH]: {
    title: NasaImagesViews.SEARCH,
    icon: 'image_search',
    route: [`/${NasaImagesViews.SEARCH}`],
    includedInNavigation: true,
  },
  [NasaImagesViews.EXPLANATION]: {
    title: NasaImagesViews.EXPLANATION,
    icon: 'speaker_notes',
    route: [`/${NasaImagesViews.EXPLANATION}`],
    includedInNavigation: true,
  },
};
