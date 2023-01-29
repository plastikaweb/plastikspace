import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/data-access';
import { ViewsConfigRecord } from '@plastik/core/entities';

export enum NasaImagesViews {
  SEARCH = 'search',
  EXPLANATION = 'explanation',
}

export const headerConfig: CoreCmsLayoutHeaderConfig = {
  showToggleMenuButton: true,
  mainIcon: { iconPath: 'assets/img/nasa.svg', svgClass: 'bg-white text-black w-[80px]' },
  mainTitle: 'NASA Images by Plastikaweb',
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
