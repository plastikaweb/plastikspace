import { map } from 'rxjs';

import { computed, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { selectNasaImagesFeature } from '@plastik/nasa-images/search/data-access';
import { NasaImage } from '@plastik/nasa-images/search/entities';
import { FormattingComponentOutput } from '@plastik/shared/formatters';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import {
  DEFAULT_TABLE_CONFIG,
  PageEventConfig,
  TableColumnFormatting,
  TableDefinition,
} from '@plastik/shared/table/entities';

const index: TableColumnFormatting<NasaImage, 'CUSTOM'> = {
  key: 'index',
  title: '#',
  pathToKey: '',
  cssClasses: ['min-w-[4rem] hidden md:flex'],
  formatting: {
    type: 'CUSTOM',
    execute: (_, __, index = 0, extraConfig) => {
      const { pageIndex, pageSize } = extraConfig as PageEventConfig;
      return String(index + pageIndex * pageSize);
    },
  },
  sticky: true,
};

const id: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'id',
  title: 'ID',
  pathToKey: 'id',
  cssClasses: ['min-w-[12rem] hidden md:flex lg:min-w-[14rem]', 'text-sm rounded-md p-tiny'],
  formatting: {
    type: 'TEXT',
  },
};

const title: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'name',
  title: 'Title',
  pathToKey: 'name',
  cssClasses: ['min-w-[10rem] lg:max-w-[25rem]', 'content-center line-clamp-5'],
  formatting: {
    type: 'TEXT',
  },
};

const description: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'description',
  title: 'Description',
  pathToKey: 'description',
  cssClasses: ['min-w-[9rem] 2xl:min-w-[24rem] hidden md:flex', 'content-center line-clamp-4'],
  formatting: {
    type: 'TEXT',
  },
};

const dateCreated: TableColumnFormatting<NasaImage, 'DATE'> = {
  key: 'dateCreated',
  title: 'Created',
  pathToKey: 'dateCreated',
  cssClasses: ['min-w-[6rem]'],
  formatting: {
    type: 'DATE',
    extras: () => ({ numberDigitsInfo: 'longDate' }),
  },
};

const thumbnail: TableColumnFormatting<NasaImage, 'COMPONENT', SharedImgContainerComponent> = {
  key: 'thumbnail',
  title: 'Image',
  pathToKey: 'thumbnail',
  cssClasses: ['relative', 'object-cover'],
  formatting: {
    type: 'COMPONENT',
    execute: (src, image, index) =>
      ({
        component: SharedImgContainerComponent,
        inputs: {
          src,
          title: image?.name,
          lcpImage: index === 0,
          quality: 70,
          dimensions: { width: 100, height: 100 },
        },
      }) as FormattingComponentOutput<SharedImgContainerComponent>,
  },
};

const creator: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'creator',
  title: 'Creator',
  pathToKey: 'creator',
  cssClasses: ['max-w-[16rem] hidden md:flex', 'xl:whitespace-normal content-center line-clamp-4'],
  formatting: {
    type: 'TEXT',
  },
};

const center: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'center',
  title: 'Center',
  pathToKey: 'center',
  cssClasses: ['max-w-[5rem] hidden md:flex lg:max-w-[6rem]'],
  formatting: {
    type: 'TEXT',
  },
};

const columnProperties = signal([
  index,
  id,
  title,
  thumbnail,
  description,
  dateCreated,
  creator,
  center,
]);

export class NasaImagesSearchFeatureTableConfig {
  static getTableDefinition() {
    const store = inject(Store);
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);
    const count = toSignal(store.pipe(select(selectNasaImagesFeature.selectCount)));

    return toSignal(
      store.select(selectRouteQueryParams).pipe(
        map(({ page = 0 }) => {
          return {
            ...defaultTableConfig,
            columnProperties,
            pagination: computed(() => ({
              ...(defaultTableConfig.pagination || {}),
              pageSize: 100,
              pageIndex: --page,
            })),
            count,
            caption: 'Nasa Images Table Results',
          };
        })
      )
    ) as Signal<TableDefinition<NasaImage>>;
  }
}
